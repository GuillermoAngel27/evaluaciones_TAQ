const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const passwordComplexity = require('joi-password-complexity');
const db = require('../db');
const { 
  logFailedLogin, 
  logSuccessfulLogin, 
  logPasswordChange, 
  logFailedPasswordChange,
  logRateLimitExceeded,
  logTokenBlacklisted,
  logInvalidTokenAccess,
  logCookieSecurityEvent,
  logLogout,
  logSessionExpired
} = require('../utils/securityLogger');
const { 
  isTokenBlacklisted, 
  blacklistToken, 
  invalidateAllUserTokens, 
  getBlacklistStats 
} = require('../utils/tokenBlacklist');
const { setAuthCookie, clearAuthCookie } = require('../config/cookies');

// Configuración de rate limiting para endpoints de autenticación
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo 20 intentos
  message: { 
    error: 'Demasiados intentos de login. Intente nuevamente en 15 minutos.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logRateLimitExceeded('/auth/login', req.ip, req.get('User-Agent'));
    res.status(429).json({
      error: 'Demasiados intentos de login. Intente nuevamente en 15 minutos.',
      retryAfter: '15 minutos'
    });
  }
});

// Configuración de rate limiting para cambio de contraseña
const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // máximo 20 intentos
  message: { 
    error: 'Demasiados intentos de cambio de contraseña. Intente nuevamente en 1 hora.',
    retryAfter: '1 hora'
    },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logRateLimitExceeded('/auth/password', req.ip, req.get('User-Agent'));
    res.status(429).json({
      error: 'Demasiados intentos de cambio de contraseña. Intente nuevamente en 1 hora.',
      retryAfter: '1 hora'
    });
  }
});

// Configuración de validación de complejidad de contraseñas
const passwordSchema = passwordComplexity({
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4
});

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  // Obtener token de cookie en lugar de header
  const token = req.cookies.authToken;

  if (!token) {
    logInvalidTokenAccess(req.ip, req.get('User-Agent'), 'missing');
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    // Verificar si token está en blacklist (con manejo de errores)
    let isBlacklisted = false;
    try {
      isBlacklisted = await isTokenBlacklisted(token);
    } catch (blacklistError) {
      // Si hay error al verificar blacklist, continuar sin verificar
      console.warn('Error verificando blacklist:', blacklistError.message);
      isBlacklisted = false;
    }
    
    if (isBlacklisted) {
      logInvalidTokenAccess(req.ip, req.get('User-Agent'), 'blacklisted');
      return res.status(401).json({ error: 'Token invalidado' });
    }

    // Verificar JWT
    jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key', (err, user) => {
      if (err) {
        logInvalidTokenAccess(req.ip, req.get('User-Agent'), 'expired');
        return res.status(403).json({ error: 'Token inválido o expirado' });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Middleware para verificar roles específicos
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    
    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'Acceso denegado. Rol insuficiente.',
        requiredRoles: allowedRoles,
        userRole: req.user.rol
      });
    }
    
    next();
  };
};

// Middleware para verificar si es administrador
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ 
      error: 'Acceso denegado. Se requiere rol de administrador.',
      userRole: req.user.rol
    });
  }
  
  next();
};

// GET /api/auth/test-cookies (para debugging)
router.get('/test-cookies', (req, res) => {
  const cookies = req.cookies;
  const headers = req.headers;
  
  res.json({
    cookies: cookies,
    hasAuthToken: !!cookies.authToken,
    userAgent: headers['user-agent'],
    origin: headers.origin,
    referer: headers.referer,
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT_SET'
    },
    requestInfo: {
      ip: req.ip,
      protocol: req.protocol,
      hostname: req.hostname,
      url: req.url
    }
  });
});

// GET /api/auth/test-auth (para debugging)
router.get('/test-auth', (req, res) => {
  const token = req.cookies.authToken;
  
  if (!token) {
    return res.json({
      authenticated: false,
      reason: 'no_token',
      cookies: req.cookies,
      headers: {
        origin: req.headers.origin,
        referer: req.headers.referer,
        userAgent: req.headers['user-agent']
      }
    });
  }

  try {
    // Verificar JWT sin verificar blacklist
    jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key', (err, user) => {
      if (err) {
        return res.json({
          authenticated: false,
          reason: 'invalid_token',
          error: err.message,
          cookies: req.cookies,
          headers: {
            origin: req.headers.origin,
            referer: req.headers.referer,
            userAgent: req.headers['user-agent']
          }
        });
      }
      
      res.json({
        authenticated: true,
        user: {
          userId: user.userId,
          username: user.username,
          rol: user.rol
        },
        token_info: {
          has_token: !!token,
          token_length: token.length
        },
        cookies: req.cookies,
        headers: {
          origin: req.headers.origin,
          referer: req.headers.referer,
          userAgent: req.headers['user-agent']
        }
      });
    });
  } catch (error) {
    res.json({
      authenticated: false,
      reason: 'verification_error',
      error: error.message,
      cookies: req.cookies,
      headers: {
        origin: req.headers.origin,
        referer: req.headers.referer,
        userAgent: req.headers['user-agent']
      }
    });
  }
});

// POST /api/auth/test-login (para debugging)
router.post('/test-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    // Buscar usuario en la base de datos
    const sql = 'SELECT * FROM usuarios WHERE username = ? AND activo = 1';
    db.query(sql, [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const user = results[0];

      // Verificar contraseña
      try {
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
          {
            userId: user.id,
            username: user.username,
            rol: user.rol,
            nombre: user.nombre,
            apellido: user.apellido
          },
          process.env.JWT_SECRET || 'dev-secret-key',
          { expiresIn: '24h' }
        );

        // Configurar cookie segura
        setAuthCookie(res, token);

        // Log de login exitoso
        logSuccessfulLogin(username, req.ip, req.get('User-Agent'));

        // Respuesta exitosa (sin token en JSON)
        res.json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            nombre: user.nombre,
            apellido: user.apellido,
            rol: user.rol
          },
          message: 'Login exitoso (test)',
          cookieSet: true
        });

      } catch (bcryptError) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    // Buscar usuario en la base de datos
    const sql = 'SELECT * FROM usuarios WHERE username = ? AND activo = 1';
    db.query(sql, [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      if (results.length === 0) {
        logFailedLogin(username, req.ip, req.get('User-Agent'));
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const user = results[0];

      // Verificar contraseña
      try {
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          logFailedLogin(username, req.ip, req.get('User-Agent'));
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
          {
            userId: user.id,
            username: user.username,
            rol: user.rol,
            nombre: user.nombre,
            apellido: user.apellido
          },
          process.env.JWT_SECRET || 'dev-secret-key',
          { expiresIn: '24h' }
        );

        // Configurar cookie segura
        setAuthCookie(res, token);

        // Actualizar fecha de última actualización
        const updateSql = 'UPDATE usuarios SET fecha_actualizacion = NOW() WHERE id = ?';
        db.query(updateSql, [user.id], (updateErr) => {
          if (updateErr) {
            // Error silencioso
          }
        });

        // Log de login exitoso
        logSuccessfulLogin(username, req.ip, req.get('User-Agent'));

        // Log de cookie creada
        logCookieSecurityEvent('cookie_created', {
          userId: user.id,
          username: user.username,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });

        // Respuesta exitosa (sin token en JSON)
        res.json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            nombre: user.nombre,
            apellido: user.apellido,
            rol: user.rol
          },
          message: 'Login exitoso'
        });

      } catch (bcryptError) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.cookies.authToken;
    
    if (token) {
      try {
        // Agregar token a blacklist
        await blacklistToken(token, req.user.userId, 'logout');
        
        // Log del evento de blacklist
        logTokenBlacklisted(req.user.userId, req.user.username, req.ip, req.get('User-Agent'), 'logout');
      } catch (blacklistError) {
        // Si hay error al agregar a blacklist, continuar con el logout
        console.warn('Error agregando token a blacklist:', blacklistError.message);
      }
    }
    
    // Eliminar cookie
    clearAuthCookie(res);
    
    // Log del logout
    logLogout(req.user.userId, req.user.username, req.ip, req.get('User-Agent'));
    
    // Log de cookie eliminada
    logCookieSecurityEvent('cookie_cleared', {
      userId: req.user.userId,
      username: req.user.username,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/verify
router.get('/verify', authenticateToken, (req, res) => {
  try {
    // Buscar información actualizada del usuario
    const sql = 'SELECT id, username, nombre, apellido, rol, activo FROM usuarios WHERE id = ? AND activo = 1';
    db.query(sql, [req.user.userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
      }

      const user = results[0];
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const sql = 'SELECT id, username, nombre, apellido, rol, fecha_creacion FROM usuarios WHERE id = ?';
    db.query(sql, [req.user.userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({
        success: true,
        user: results[0]
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/auth/password
router.put('/password', authenticateToken, passwordChangeLimiter, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Contraseña actual y nueva contraseña son requeridas' });
    }

    // Validar complejidad de la nueva contraseña
    try {
      await passwordSchema.validateAsync(newPassword);
    } catch (validationError) {
      return res.status(400).json({ 
        error: 'La nueva contraseña no cumple los requisitos de seguridad',
        requirements: {
          minLength: 8,
          maxLength: 30,
          requireLowercase: true,
          requireUppercase: true,
          requireNumbers: true,
          requireSymbols: true
        },
        details: validationError.message
      });
    }

    // Verificar contraseña actual
    const sql = 'SELECT password FROM usuarios WHERE id = ?';
    db.query(sql, [req.user.userId], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const isValidCurrentPassword = await bcrypt.compare(currentPassword, results[0].password);
      
      if (!isValidCurrentPassword) {
        logFailedPasswordChange(req.user.userId, req.ip, req.get('User-Agent'), 'current_password_incorrect');
        return res.status(400).json({ error: 'Contraseña actual incorrecta' });
      }

      // Hashear nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar contraseña
      const updateSql = 'UPDATE usuarios SET password = ?, fecha_actualizacion = NOW() WHERE id = ?';
      db.query(updateSql, [hashedNewPassword, req.user.userId], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Log de cambio de contraseña exitoso
        logPasswordChange(req.user.userId, req.ip, req.get('User-Agent'));

        res.json({
          success: true,
          message: 'Contraseña actualizada exitosamente'
        });
      });
    });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/invalidate-all-tokens (solo administradores)
router.post('/invalidate-all-tokens', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId, reason = 'security' } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId es requerido' });
    }
    
    // Invalidar todos los tokens del usuario
    await invalidateAllUserTokens(userId, reason);
    
    // Log del evento
    logTokenBlacklisted(userId, 'admin_action', req.ip, req.get('User-Agent'), reason);
    
    res.json({
      success: true,
      message: `Todos los tokens del usuario ${userId} han sido invalidados`,
      reason: reason
    });
  } catch (error) {
    console.error('Error invalidando tokens:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/blacklist-stats (solo administradores)
router.get('/blacklist-stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await getBlacklistStats();
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Exportar middleware para uso en otras rutas
module.exports = { router, authenticateToken, requireRole, requireAdmin }; 