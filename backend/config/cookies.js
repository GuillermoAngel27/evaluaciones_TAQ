// Configuración de cookies para la aplicación
const cookieConfig = {
  // Configuración para cookies de autenticación
  auth: {
    httpOnly: true,        // No accesible desde JavaScript
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'strict',    // Previene CSRF
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/'
  },
  
  // Configuración para limpiar cookies
  clear: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
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
    httpOnly: true,
    secure: true,          // Solo HTTPS
    sameSite: 'strict',    // Máxima seguridad
    maxAge: 24 * 60 * 60 * 1000,
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