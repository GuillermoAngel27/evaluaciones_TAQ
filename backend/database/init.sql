-- Script de inicialización de la base de datos evaluaciones
-- Ejecutar: mysql -u root -proot1234 evaluaciones < init.sql

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  rol ENUM('administrador', 'normal') NOT NULL DEFAULT 'normal',
  activo BOOLEAN NOT NULL DEFAULT 1,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de locales
CREATE TABLE IF NOT EXISTS locales (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo_local ENUM('alimentos', 'miscelaneas', 'taxis', 'estacionamiento') NOT NULL,
  estatus ENUM('activo', 'inactivo') DEFAULT 'activo',
  token_publico VARCHAR(16) UNIQUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de evaluaciones
CREATE TABLE IF NOT EXISTS evaluaciones (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  local_id INT(11) NOT NULL,
  puntuacion INT(11) NOT NULL,
  comentario TEXT,
  fecha DATETIME NOT NULL,
  turno INT(10) UNSIGNED NOT NULL DEFAULT 1,
  FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE
);

-- Crear tabla de respuestas
CREATE TABLE IF NOT EXISTS respuestas (
  evaluacion_id INT(11) NOT NULL,
  pregunta INT(11) NOT NULL,
  puntuacion INT(11) NOT NULL,
  PRIMARY KEY (evaluacion_id, pregunta),
  FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones(id) ON DELETE CASCADE
);

-- Crear tabla de turnos
CREATE TABLE IF NOT EXISTS turnos (
  turno INT(10) UNSIGNED NOT NULL,
  hra_ini VARCHAR(8) NOT NULL,
  hra_fin VARCHAR(8) NOT NULL,
  PRIMARY KEY (turno, hra_ini)
); 

-- Crear tabla de blacklist de tokens
CREATE TABLE IF NOT EXISTS token_blacklist (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  token_hash CHAR(64) NOT NULL UNIQUE,
  user_id INT(11) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reason ENUM('logout', 'security', 'expired') DEFAULT 'logout',
  
  -- Clave foránea para integridad referencial
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Insertar los turnos según los rangos especificados
INSERT INTO turnos (turno, hra_ini, hra_fin) VALUES
(1, '05:30:01', '13:30:00'),
(2, '13:30:01', '21:00:00'),
(3, '00:00:00', '05:30:00'),
(4, '21:00:01', '23:59:59');
