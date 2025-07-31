const db = require('../db');

/**
 * Determina el turno actual basado en la hora del sistema
 * @returns {Promise<number>} El número del turno actual
 */
function obtenerTurnoActual() {
  return new Promise((resolve, reject) => {
    const horaActual = new Date();
    const horaString = horaActual.toTimeString().slice(0, 8); // Formato HH:MM:SS
    
    // Consultar la tabla de turnos para encontrar el turno correspondiente
    const sql = `
      SELECT turno 
      FROM turnos 
      WHERE ? BETWEEN hra_ini AND hra_fin 
      LIMIT 1
    `;
    
    db.query(sql, [horaString], (err, results) => {
      if (err) {
        console.error('Error obteniendo turno actual:', err);
        reject(err);
        return;
      }
      
      if (results.length === 0) {
        // Si no se encuentra un turno, usar turno por defecto
        console.warn('No se encontró turno para la hora:', horaString, '- Usando Turno 1 por defecto');
        resolve(1);
        return;
      }
      
      resolve(results[0].turno);
    });
  });
}

/**
 * Valida si se puede evaluar en el turno actual
 * @param {number} turnoActual - El turno actual
 * @param {number} turnoPermitido - El turno permitido para evaluar (opcional)
 * @returns {boolean} True si se puede evaluar, false en caso contrario
 */
function validarTurnoEvaluacion(turnoActual, turnoPermitido = null) {
  // Si no se especifica un turno permitido, se permite evaluar en cualquier turno
  if (!turnoPermitido) {
    return true;
  }
  
  return turnoActual === turnoPermitido;
}

/**
 * Obtiene información de todos los turnos
 * @returns {Promise<Array>} Array con información de todos los turnos
 */
function obtenerTodosLosTurnos() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM turnos ORDER BY turno, hra_ini';
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error obteniendo turnos:', err);
        reject(err);
        return;
      }
      
      resolve(results);
    });
  });
}

/**
 * Convierte el número de turno a texto para mostrar
 * @param {number} turno - El número del turno
 * @param {string} hra_ini - Hora de inicio (opcional, para diferenciar turnos 3)
 * @returns {string} El texto del turno
 */
function turnoATexto(turno, hra_ini = null) {
  switch (turno) {
    case 1:
      return 'Turno 1 (Mañana)';
    case 2:
      return 'Turno 2 (Tarde)';
    case 3:
      // Diferenciar entre los dos turnos 3 basado en la hora de inicio
      if (hra_ini === '00:00:00') {
        return 'Turno 3 - Madrugada (00:00 - 05:30)';
      } else if (hra_ini === '21:00:01') {
        return 'Turno 3 - Noche (21:00 - 24:00)';
      } else {
        return 'Turno 3';
      }
    default:
      return `Turno ${turno}`;
  }
}

/**
 * Genera un identificador único para un turno basado en su número y hora de inicio
 * @param {number} turno - El número del turno
 * @param {string} hra_ini - La hora de inicio
 * @returns {string} Identificador único del turno
 */
function generarTurnoId(turno, hra_ini) {
  if (turno === 3) {
    if (hra_ini === '00:00:00') {
      return '3-madrugada';
    } else if (hra_ini === '21:00:01') {
      return '3-noche';
    }
  }
  return turno.toString();
}

/**
 * Obtiene el turno actual en formato texto
 * @returns {Promise<string>} El texto del turno actual
 */
function obtenerTurnoActualTexto() {
  return obtenerTurnoActual().then(turno => turnoATexto(turno));
}

module.exports = {
  obtenerTurnoActual,
  obtenerTurnoActualTexto,
  validarTurnoEvaluacion,
  obtenerTodosLosTurnos,
  turnoATexto,
  generarTurnoId
}; 