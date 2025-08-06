const crypto = require('crypto');
const db = require('../db');

// Función para hashear token (por seguridad)
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Verificar si token está en blacklist
const isTokenBlacklisted = async (token) => {
  const tokenHash = hashToken(token);
  
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id FROM token_blacklist 
      WHERE token_hash = ? AND expires_at > NOW()
      LIMIT 1
    `;
    
    db.query(sql, [tokenHash], (err, results) => {
      if (err) {
        // Si la tabla no existe, considerar que no está en blacklist
        if (err.code === 'ER_NO_SUCH_TABLE') {
          console.warn('Tabla token_blacklist no existe, continuando sin verificación');
          resolve(false);
        } else {
          console.error('Error verificando blacklist:', err);
          reject(err);
        }
      } else {
        resolve(results.length > 0);
      }
    });
  });
};

// Agregar token a blacklist
const blacklistToken = async (token, userId, reason = 'logout') => {
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
  
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO token_blacklist (token_hash, user_id, expires_at, reason) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        expires_at = VALUES(expires_at),
        reason = VALUES(reason)
    `;
    
    db.query(sql, [tokenHash, userId, expiresAt, reason], (err, result) => {
      if (err) {
        // Si la tabla no existe, crear un log pero no fallar
        if (err.code === 'ER_NO_SUCH_TABLE') {
          console.warn('Tabla token_blacklist no existe, no se puede agregar token a blacklist');
          resolve({ warning: 'Tabla blacklist no disponible' });
        } else {
          console.error('Error agregando token a blacklist:', err);
          reject(err);
        }
      } else {
        resolve(result);
      }
    });
  });
};

// Limpiar tokens expirados
const cleanupExpiredTokens = async () => {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM token_blacklist 
      WHERE expires_at <= NOW() 
      OR created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
    `;
    
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error limpiando tokens expirados:', err);
        reject(err);
      } else {
        console.log(`🧹 Limpieza automática: ${result.affectedRows} tokens expirados eliminados`);
        resolve(result.affectedRows);
      }
    });
  });
};

// Obtener estadísticas de blacklist
const getBlacklistStats = async () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        COUNT(*) as total_tokens,
        COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active_tokens,
        COUNT(CASE WHEN expires_at <= NOW() THEN 1 END) as expired_tokens,
        COUNT(CASE WHEN reason = 'logout' THEN 1 END) as logout_tokens,
        COUNT(CASE WHEN reason = 'security' THEN 1 END) as security_tokens,
        COUNT(CASE WHEN reason = 'expired' THEN 1 END) as expired_reason_tokens
      FROM token_blacklist
    `;
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error obteniendo estadísticas de blacklist:', err);
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

// Invalidar todos los tokens de un usuario (para casos de seguridad)
const invalidateAllUserTokens = async (userId, reason = 'security') => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE token_blacklist 
      SET expires_at = NOW(), reason = ?
      WHERE user_id = ? AND expires_at > NOW()
    `;
    
    db.query(sql, [reason, userId], (err, result) => {
      if (err) {
        console.error('Error invalidando tokens de usuario:', err);
        reject(err);
      } else {
        console.log(`🔒 Invalidados ${result.affectedRows} tokens del usuario ${userId}`);
        resolve(result.affectedRows);
      }
    });
  });
};

// Verificar si un usuario tiene tokens activos en blacklist
const hasActiveBlacklistedTokens = async (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT COUNT(*) as count 
      FROM token_blacklist 
      WHERE user_id = ? AND expires_at > NOW()
    `;
    
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error verificando tokens activos del usuario:', err);
        reject(err);
      } else {
        resolve(results[0].count > 0);
      }
    });
  });
};

module.exports = {
  hashToken,
  isTokenBlacklisted,
  blacklistToken,
  cleanupExpiredTokens,
  getBlacklistStats,
  invalidateAllUserTokens,
  hasActiveBlacklistedTokens
}; 