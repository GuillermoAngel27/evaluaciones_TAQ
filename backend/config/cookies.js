// Configuración de cookies para la aplicación
const cookieConfig = {
  // Configuración para cookies de autenticación
  auth: {
    httpOnly: process.env.COOKIE_HTTPONLY === 'true' || true,        // No accesible desde JavaScript
    secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === 'production' ? 'strict' : 'lax'), // Usar variable de entorno
    maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000, // Usar variable de entorno
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/'
  },
  
  // Configuración para limpiar cookies
  clear: {
    httpOnly: process.env.COOKIE_HTTPONLY === 'true' || true,
    secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
    sameSite: process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === 'production' ? 'strict' : 'lax'),
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/'
  },
  
  // Configuración para desarrollo
  development: {
    httpOnly: true,
    secure: false,         // Permitir HTTP en desarrollo
    sameSite: 'lax',       // Más permisivo en desarrollo
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  },
  
  // Configuración para producción
  production: {
    httpOnly: process.env.COOKIE_HTTPONLY === 'true' || true,
    secure: process.env.COOKIE_SECURE === 'true' || true,          // Solo HTTPS
    sameSite: process.env.COOKIE_SAMESITE || 'strict',    // Usar variable de entorno
    maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000,
    domain: process.env.COOKIE_DOMAIN,
    path: '/'
  }
};

// Función para obtener configuración según el entorno
const getCookieConfig = (type = 'auth') => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    return { ...cookieConfig[type], ...cookieConfig.production };
  } else {
    return { ...cookieConfig[type], ...cookieConfig.development };
  }
};

// Función para configurar cookie de autenticación
const setAuthCookie = (res, token) => {
  const config = getCookieConfig('auth');
  res.cookie('authToken', token, config);
};

// Función para limpiar cookie de autenticación
const clearAuthCookie = (res) => {
  const config = getCookieConfig('clear');
  res.clearCookie('authToken', config);
};

module.exports = {
  cookieConfig,
  getCookieConfig,
  setAuthCookie,
  clearAuthCookie
}; 