-- Script de inicialización de la base de datos evaluaciones
-- Ejecutar: mysql -u root -proot1234 evaluaciones < init.sql

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  rol ENUM('administrador', 'supervisor', 'evaluador', 'viewer') NOT NULL DEFAULT 'viewer',
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

-- Insertar turnos
INSERT INTO turnos (turno, hra_ini, hra_fin) VALUES
(1, '05:30:01', '13:30:00'),
(2, '13:30:01', '21:00:00'),
(3, '00:00:00', '05:30:00'),
(4, '21:00:01', '23:59:59');

-- Insertar usuarios de prueba (las contraseñas serán hasheadas por el script generate-passwords.js)
INSERT INTO usuarios (username, password, nombre, apellido, rol) VALUES
('admin', '$2b$10$placeholder', 'Administrador', 'Sistema', 'administrador'),
('supervisor1', '$2b$10$placeholder', 'Supervisor', 'Uno', 'supervisor'),
('supervisor2', '$2b$10$placeholder', 'Supervisor', 'Dos', 'supervisor'),
('evaluador1', '$2b$10$placeholder', 'Evaluador', 'Uno', 'evaluador'),
('evaluador2', '$2b$10$placeholder', 'Evaluador', 'Dos', 'evaluador'),
('evaluador3', '$2b$10$placeholder', 'Evaluador', 'Tres', 'evaluador'),
('viewer1', '$2b$10$placeholder', 'Viewer', 'Uno', 'viewer'),
('viewer2', '$2b$10$placeholder', 'Viewer', 'Dos', 'viewer');

-- Insertar locales de prueba
INSERT INTO locales (nombre, tipo_local, estatus, token_publico) VALUES
('Restaurante El Buen Sabor', 'alimentos', 'activo', 'ABC123456789DEF0'),
('Miscelánea La Esquina', 'miscelaneas', 'activo', 'DEF123456789ABC0'),
('Taxi Seguro 24/7', 'taxis', 'activo', 'GHI123456789JKL0'),
('Estacionamiento Central', 'estacionamiento', 'activo', 'MNO123456789PQR0'),
('Cafetería Express', 'alimentos', 'activo', 'STU123456789VWX0'),
('Tienda de Conveniencia', 'miscelaneas', 'activo', 'YZA123456789BCD0');

-- Insertar evaluaciones de prueba
INSERT INTO evaluaciones (local_id, puntuacion, comentario, fecha, turno) VALUES
(1, 4, 'Excelente servicio y comida deliciosa', '2024-01-15 12:30:00', 1),
(1, 5, 'Muy buena atención al cliente', '2024-01-16 13:45:00', 1),
(2, 3, 'Buen servicio pero algo lento', '2024-01-17 14:20:00', 2),
(3, 4, 'Conductor muy profesional', '2024-01-18 15:10:00', 2),
(4, 5, 'Estacionamiento muy limpio y seguro', '2024-01-19 16:30:00', 2),
(5, 4, 'Café excelente y servicio rápido', '2024-01-20 08:15:00', 1);

-- Insertar respuestas de prueba
INSERT INTO respuestas (evaluacion_id, pregunta, puntuacion) VALUES
(1, 1, 4), (1, 2, 4), (1, 3, 5), (1, 4, 4), (1, 5, 4),
(2, 1, 5), (2, 2, 5), (2, 3, 5), (2, 4, 5), (2, 5, 5),
(3, 1, 3), (3, 2, 3), (3, 3, 4), (3, 4, 3), (3, 5, 3),
(4, 1, 4), (4, 2, 4), (4, 3, 4), (4, 4, 5), (4, 5, 4),
(5, 1, 5), (5, 2, 5), (5, 3, 5), (5, 4, 5), (5, 5, 5),
(6, 1, 4), (6, 2, 4), (6, 3, 5), (6, 4, 4), (6, 5, 4); 