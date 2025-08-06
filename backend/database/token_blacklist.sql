-- Script para crear tabla de blacklist de tokens
-- Ejecutar: mysql -u root -proot1234 evaluaciones < token_blacklist.sql

-- Crear tabla de blacklist de tokens
CREATE TABLE IF NOT EXISTS token_blacklist (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  token_hash CHAR(64) NOT NULL UNIQUE,
  user_id INT(11) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reason ENUM('logout', 'security', 'expired') DEFAULT 'logout',
  
  -- Índices optimizados para consultas rápidas
  INDEX idx_token_hash (token_hash),
  INDEX idx_expires_at (expires_at),
  INDEX idx_user_expires (user_id, expires_at),
  INDEX idx_cleanup (expires_at, created_at),
  
  -- Clave foránea para integridad referencial
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Crear procedimiento almacenado para limpieza automática
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS CleanupExpiredTokens()
BEGIN
  DELETE FROM token_blacklist 
  WHERE expires_at <= NOW() 
  OR created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
  
  SELECT ROW_COUNT() as deleted_count;
END //
DELIMITER ;

-- Crear evento para limpieza automática (ejecutar cada hora)
-- Nota: Requiere que event_scheduler esté habilitado
-- SET GLOBAL event_scheduler = ON;

-- CREATE EVENT IF NOT EXISTS cleanup_tokens_hourly
-- ON SCHEDULE EVERY 1 HOUR
-- DO CALL CleanupExpiredTokens();

-- Crear evento para limpieza diaria (ejecutar cada día a las 2 AM)
-- CREATE EVENT IF NOT EXISTS cleanup_tokens_daily
-- ON SCHEDULE EVERY 1 DAY
-- STARTS CURRENT_DATE + INTERVAL 2 HOUR
-- DO CALL CleanupExpiredTokens();

-- Insertar comentarios explicativos
INSERT INTO token_blacklist (token_hash, user_id, expires_at, reason) 
VALUES ('dummy_hash_for_comments_only', 1, NOW() - INTERVAL 1 DAY, 'expired')
ON DUPLICATE KEY UPDATE expires_at = expires_at;

-- Eliminar el registro dummy
DELETE FROM token_blacklist WHERE token_hash = 'dummy_hash_for_comments_only'; 