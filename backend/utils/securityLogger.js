const fs = require('fs');
const path = require('path');

// Función para escribir logs de seguridad
const logSecurityEvent = (event, details) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    ...details
  };

  const logMessage = JSON.stringify(logEntry) + '\n';
  const logFile = path.join(__dirname, '../logs/security.log');

  // Crear directorio de logs si no existe
  const logDir = path.dirname(logFile);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Escribir log de forma asíncrona
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.error('Error escribiendo log de seguridad:', err);
    }
  });
};

// Función para log de login fallido
const logFailedLogin = (username, ip, userAgent) => {
  logSecurityEvent('login_failed', {
    username,
    ip,
    userAgent,
    type: 'authentication_failure'
  });
};

// Función para log de login exitoso
const logSuccessfulLogin = (username, ip, userAgent) => {
  logSecurityEvent('login_success', {
    username,
    ip,
    userAgent,
    type: 'authentication_success'
  });
};

// Función para log de cambio de contraseña
const logPasswordChange = (userId, ip, userAgent) => {
  logSecurityEvent('password_change', {
    userId,
    ip,
    userAgent,
    type: 'password_operation'
  });
};

// Función para log de intentos de cambio de contraseña fallidos
const logFailedPasswordChange = (userId, ip, userAgent, reason) => {
  logSecurityEvent('password_change_failed', {
    userId,
    ip,
    userAgent,
    reason,
    type: 'password_operation_failure'
  });
};

// Función para log de rate limiting
const logRateLimitExceeded = (endpoint, ip, userAgent) => {
  logSecurityEvent('rate_limit_exceeded', {
    endpoint,
    ip,
    userAgent,
    type: 'security_threshold_exceeded'
  });
};

// Función para log de token blacklisted
const logTokenBlacklisted = (userId, username, ip, userAgent, reason) => {
  logSecurityEvent('token_blacklisted', {
    userId,
    username,
    ip,
    userAgent,
    reason,
    type: 'token_invalidation'
  });
};

// Función para log de acceso con token inválido
const logInvalidTokenAccess = (ip, userAgent, tokenType) => {
  logSecurityEvent('invalid_token_access', {
    ip,
    userAgent,
    tokenType, // 'blacklisted', 'expired', 'missing'
    type: 'unauthorized_access_attempt'
  });
};

// Función para log de eventos de cookies
const logCookieSecurityEvent = (event, details) => {
  logSecurityEvent('cookie_security', {
    ...details,
    type: 'cookie_operation'
  });
};

// Función para log de logout
const logLogout = (userId, username, ip, userAgent) => {
  logSecurityEvent('logout', {
    userId,
    username,
    ip,
    userAgent,
    type: 'session_termination'
  });
};

// Función para log de sesión expirada
const logSessionExpired = (userId, username, ip, userAgent) => {
  logSecurityEvent('session_expired', {
    userId,
    username,
    ip,
    userAgent,
    type: 'session_timeout'
  });
};

module.exports = {
  logSecurityEvent,
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
}; 