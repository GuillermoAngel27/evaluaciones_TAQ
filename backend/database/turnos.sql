-- Tabla de turnos
CREATE TABLE IF NOT EXISTS turnos (
  turno INT(10) UNSIGNED NOT NULL,
  hra_ini VARCHAR(8) NOT NULL,
  hra_fin VARCHAR(8) NOT NULL,
  PRIMARY KEY (turno, hra_ini)
);

-- Insertar los turnos según los rangos especificados
INSERT INTO turnos (turno, hra_ini, hra_fin) VALUES
(1, '05:30:01', '13:30:00'),
(2, '13:30:01', '21:00:00'),
(3, '00:00:00', '05:30:00'),
(4, '21:00:01', '23:59:59');

-- Actualizar la tabla evaluaciones para incluir el campo turno
ALTER TABLE evaluaciones ADD COLUMN turno INT(10) UNSIGNED NOT NULL DEFAULT 1 AFTER fecha; 