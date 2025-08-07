// Configuración específica para producción
const productionConfig = {
  // Configuración de cookies para producción
  cookies: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/'
  },
  
  // Configuración de CORS para producción
  cors: {
    origin: [
      'https://evaluaciones.taqro.com.mx',
      'https://admine.taqro.com.mx', 
      'https://evaluacion.taqro.com.mx'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  
  // Configuración de seguridad
  security: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
    jwtExpiresIn: '24h',
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutos
    rateLimitMax: 6 // máximo 6 intentos
  },
  
  // Configuración de logging
  logging: {
    enabled: true,
    level: 'info'
  }
};

module.exports = productionConfig;
