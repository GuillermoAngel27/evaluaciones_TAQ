const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
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

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    // Buscar usuario en la base de datos
    const sql = 'SELECT * FROM usuarios WHERE username = ? AND activo = 1';
    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.error('Error en consulta de login:', err);
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

        // Actualizar fecha de última actualización
        const updateSql = 'UPDATE usuarios SET fecha_actualizacion = NOW() WHERE id = ?';
        db.query(updateSql, [user.id], (updateErr) => {
          if (updateErr) {
            console.error('Error actualizando fecha de usuario:', updateErr);
          }
        });

        // Respuesta exitosa
        res.json({
          success: true,
          token,
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
        console.error('Error comparando contraseñas:', bcryptError);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  try {
    // El logout no requiere autenticación ya que el cliente ya limpió el token
    // En una implementación más robusta, podrías invalidar el token en el servidor
    // Por ahora, solo respondemos exitosamente
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
        console.error('Error verificando usuario:', err);
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
    console.error('Error en verify:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const sql = 'SELECT id, username, nombre, apellido, rol, fecha_creacion FROM usuarios WHERE id = ?';
    db.query(sql, [req.user.userId], (err, results) => {
      if (err) {
        console.error('Error obteniendo perfil:', err);
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
    console.error('Error en profile:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/auth/password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Contraseña actual y nueva contraseña son requeridas' });
    }

    // Verificar contraseña actual
    const sql = 'SELECT password FROM usuarios WHERE id = ?';
    db.query(sql, [req.user.userId], async (err, results) => {
      if (err) {
        console.error('Error obteniendo contraseña actual:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const isValidCurrentPassword = await bcrypt.compare(currentPassword, results[0].password);
      
      if (!isValidCurrentPassword) {
        return res.status(400).json({ error: 'Contraseña actual incorrecta' });
      }

      // Hashear nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar contraseña
      const updateSql = 'UPDATE usuarios SET password = ?, fecha_actualizacion = NOW() WHERE id = ?';
      db.query(updateSql, [hashedNewPassword, req.user.userId], (updateErr) => {
        if (updateErr) {
          console.error('Error actualizando contraseña:', updateErr);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }

        res.json({
          success: true,
          message: 'Contraseña actualizada exitosamente'
        });
      });
    });

  } catch (error) {
    console.error('Error en cambio de contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Exportar middleware para uso en otras rutas
module.exports = { router, authenticateToken, requireRole, requireAdmin }; 