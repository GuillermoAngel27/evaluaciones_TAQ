// Configuración de seguridad para la aplicación
module.exports = {
  // Configuración de rate limiting
  rateLimit: {
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 6, // máximo 6 intentos
      message: 'Demasiados intentos de login. Intente nuevamente en 15 minutos.'
    },
    passwordChange: {
      windowMs: 60 * 60 * 1000, // 1 hora
      max: 3, // máximo 3 intentos
      message: 'Demasiados intentos de cambio de contraseña. Intente nuevamente en 1 hora.'
    },
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // máximo 100 requests por IP
      message: 'Demasiadas solicitudes. Intente nuevamente más tarde.'
    }
  },

  // Configuración de complejidad de contraseñas
  passwordPolicy: {
    minLength: 8,
    maxLength: 30,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    requirementCount: 4
  },

  // Configuración de JWT
  jwt: {
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },

  // Configuración de cookies
  cookies: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  },

  // Configuración de logging
  logging: {
    enabled: true,
    logFile: 'logs/security.log',
    logLevel: 'info'
  },

  // Configuración de headers de seguridad
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      }
    }
  }
}; 