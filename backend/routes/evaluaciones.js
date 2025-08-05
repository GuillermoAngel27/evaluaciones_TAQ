const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole, requireAdmin } = require('./auth');
const db = require('../db');
const { obtenerTurnoActual, obtenerTurnoActualTexto } = require('../utils/turnoUtils');

// GET - Obtener todas las evaluaciones con filtros opcionales (ambos roles pueden ver)
router.get('/', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const { local_id, fecha_desde, fecha_hasta } = req.query;
  
  let sql = 'SELECT * FROM evaluaciones';
  const params = [];
  const conditions = [];
  
  if (local_id) {
    conditions.push('local_id = ?');
    params.push(local_id);
  }
  
  if (fecha_desde) {
    conditions.push('fecha >= ?');
    params.push(fecha_desde);
  }
  
  if (fecha_hasta) {
    conditions.push('fecha <= ?');
    params.push(fecha_hasta + ' 23:59:59');
  }
  
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  
  sql += ' ORDER BY fecha DESC';
  
  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET - Obtener turno actual (sin autenticación - para evaluación pública)
router.get('/turno-actual', (req, res) => {
  obtenerTurnoActualTexto()
    .then(turno => {
      res.json({ turno });
    })
    .catch(err => {
      res.status(500).json({ error: 'Error al obtener el turno actual' });
    });
});

// GET - Obtener todos los turnos (para el dropdown)
router.get('/turnos', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const { obtenerTodosLosTurnos, turnoATexto, generarTurnoId } = require('../utils/turnoUtils');
  
  obtenerTodosLosTurnos()
    .then(turnos => {
      // Formatear los turnos para el dropdown
      const turnosFormateados = turnos.map(turno => ({
        id: generarTurnoId(turno.turno, turno.hra_ini),
        turno_numero: turno.turno,
        texto: turnoATexto(turno.turno, turno.hra_ini),
        hra_ini: turno.hra_ini,
        hra_fin: turno.hra_fin
      }));
      
      res.json(turnosFormateados);
    })
    .catch(err => {
      res.status(500).json({ error: 'Error al obtener los turnos' });
    });
});

// GET - Obtener preguntas por tipo de local (ambos roles pueden ver)
router.get('/preguntas/:tipo', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const { tipo } = req.params;
  
  try {
    
    // Usar la configuración de preguntas del archivo config
    const { obtenerPreguntas, normalizarTipoLocal } = require('../config/preguntas');
    
    const tipoNormalizado = normalizarTipoLocal(tipo);
    
    const preguntas = obtenerPreguntas(tipo);
    
    // Asegurar que la respuesta tenga el formato correcto
    if (!Array.isArray(preguntas) || preguntas.length === 0) {
      // Fallback básico
      const preguntasFallback = [
        { pregunta_numero: 1, pregunta_texto: '¿El personal fue amable?' },
        { pregunta_numero: 2, pregunta_texto: '¿El local estaba limpio?' },
        { pregunta_numero: 3, pregunta_texto: '¿La atención fue rápida?' },
        { pregunta_numero: 4, pregunta_texto: '¿Al finalizar su compra le entregaron ticket?' }
      ];
      return res.json(preguntasFallback);
    }
    
    res.json(preguntas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET - Obtener una evaluación específica (ambos roles pueden ver)
router.get('/:id', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM evaluaciones WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Evaluación no encontrada' });
    }
    res.json(results[0]);
  });
});

// GET - Obtener respuestas de una evaluación específica (ambos roles pueden ver)
router.get('/:id/respuestas', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM respuestas WHERE evaluacion_id = ? ORDER BY pregunta';
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// POST - Crear una nueva evaluación (sin autenticación - para evaluación pública)
router.post('/', async (req, res) => {
  const { token, device_id, respuestas, preguntas, comentario } = req.body;
  
  if (!token || !device_id || !respuestas || !preguntas) {
    return res.status(400).json({ error: 'Token, device_id, respuestas y preguntas son obligatorios' });
  }
  
  try {
    // Obtener el turno actual
    const turnoActual = await obtenerTurnoActual();
    
    // Verificar que el token existe y no ha sido usado
    const tokenSql = 'SELECT * FROM tokens WHERE token = ? AND device_id = ? AND usado = 0';
    db.query(tokenSql, [token, device_id], (err, tokenResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (tokenResults.length === 0) {
        return res.status(400).json({ error: 'Token inválido o ya usado' });
      }
      
      const tokenInfo = tokenResults[0];
      const local_id = tokenInfo.local_id;
      
      // Calcular puntuación promedio
      const puntuacion = respuestas.reduce((sum, val) => sum + val, 0) / respuestas.length;
      
      // Insertar evaluación con el turno actual
      const evalSql = 'INSERT INTO evaluaciones (local_id, puntuacion, comentario, fecha, turno) VALUES (?, ?, ?, NOW(), ?)';
      db.query(evalSql, [local_id, puntuacion, comentario || null, turnoActual], (err, evalResult) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        const evaluacion_id = evalResult.insertId;
        
        // Insertar respuestas
        const respuestasValues = respuestas.map((respuesta, index) => [
          evaluacion_id,
          index + 1,
          respuesta
        ]);
        
        const respSql = 'INSERT INTO respuestas (evaluacion_id, pregunta, puntuacion) VALUES ?';
        db.query(respSql, [respuestasValues], (err, respResult) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          // Marcar token como usado
          const updateTokenSql = 'UPDATE tokens SET usado = 1, fecha_usado = NOW() WHERE token = ? AND device_id = ?';
          db.query(updateTokenSql, [token, device_id], (err) => {
            if (err) {
              // Error silencioso
            }
            
                  res.status(201).json({
        id: evaluacion_id,
        local_id,
        puntuacion,
        comentario,
        turno: turnoActual,
        turno_texto: `Turno ${turnoActual}`,
        message: 'Evaluación creada correctamente'
      });
          });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al validar el turno actual' });
  }
});

// DELETE - Eliminar una evaluación (solo administradores)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  
  // Eliminar respuestas primero
  const deleteRespuestasSql = 'DELETE FROM respuestas WHERE evaluacion_id = ?';
  db.query(deleteRespuestasSql, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Eliminar evaluación
    const deleteEvalSql = 'DELETE FROM evaluaciones WHERE id = ?';
    db.query(deleteEvalSql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Evaluación no encontrada' });
      }
      res.json({ message: 'Evaluación eliminada correctamente' });
    });
  });
});

// ===== ENDPOINTS PARA DASHBOARD =====

// GET - Estadísticas generales del dashboard
router.get('/dashboard/stats', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const statsSql = `
    SELECT 
      COUNT(DISTINCT l.id) as totalLocales,
      COUNT(e.id) as totalEvaluaciones,
      ROUND(AVG(e.puntuacion)) as promedioCalificacion,
      COUNT(CASE WHEN DATE(e.fecha) = CURDATE() THEN 1 END) as evaluacionesHoy,
      COUNT(DISTINCT CASE WHEN l.estatus = 'activo' THEN l.id END) as localesActivos,
      COUNT(DISTINCT CASE WHEN l.estatus = 'inactivo' THEN l.id END) as localesInactivos
    FROM locales l
    LEFT JOIN evaluaciones e ON l.id = e.local_id
  `;
  
  db.query(statsSql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Convertir valores a números
    const stats = results[0];
    stats.totalLocales = parseInt(stats.totalLocales);
    stats.totalEvaluaciones = parseInt(stats.totalEvaluaciones);
    stats.promedioCalificacion = Math.round(parseFloat(stats.promedioCalificacion));
    stats.evaluacionesHoy = parseInt(stats.evaluacionesHoy);
    stats.localesActivos = parseInt(stats.localesActivos);
    stats.localesInactivos = parseInt(stats.localesInactivos);
    
    res.json(stats);
  });
});

// GET - Top locales más evaluados
router.get('/dashboard/top-locales', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  
  const topSql = `
    SELECT 
      l.id,
      l.nombre,
      l.tipo_local as tipo,
      COUNT(e.id) as evaluaciones,
      ROUND(AVG(e.puntuacion)) as promedio
    FROM locales l
    LEFT JOIN evaluaciones e ON l.id = e.local_id
    GROUP BY l.id, l.nombre, l.tipo_local
    HAVING COUNT(e.id) > 0
    ORDER BY evaluaciones DESC
    LIMIT ?
  `;
  
  db.query(topSql, [limit], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Agregar posición manualmente y convertir valores a números
    const resultsWithPosition = results.map((item, index) => ({
      ...item,
      id: parseInt(item.id),
      evaluaciones: parseInt(item.evaluaciones),
      promedio: Math.round(parseFloat(item.promedio)),
      posicion: index + 1
    }));
    
    res.json(resultsWithPosition);
  });
});

// GET - Últimas evaluaciones
router.get('/dashboard/ultimas', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  
  const ultimasSql = `
    SELECT 
      e.id,
      l.nombre as local,
      l.tipo_local as tipo,
      e.puntuacion as calificacion,
      e.comentario,
      DATE_FORMAT(e.fecha, '%d/%m/%Y %H:%i') as fecha
    FROM evaluaciones e
    JOIN locales l ON e.local_id = l.id
    ORDER BY e.fecha DESC
    LIMIT ?
  `;
  
  db.query(ultimasSql, [limit], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET - Comentarios recientes
router.get('/dashboard/comentarios', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  
  const comentariosSql = `
    SELECT 
      e.id,
      l.nombre as local,
      'Usuario' as usuario,
      e.puntuacion as calificacion,
      e.comentario,
      DATE_FORMAT(e.fecha, '%d/%m/%Y %H:%i') as fecha
    FROM evaluaciones e
    JOIN locales l ON e.local_id = l.id
    WHERE e.comentario IS NOT NULL AND e.comentario != ''
    ORDER BY e.fecha DESC
    LIMIT ?
  `;
  
  db.query(comentariosSql, [limit], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET - Calificaciones por tipo de local
router.get('/dashboard/calificaciones-por-tipo', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const calificacionesSql = `
    SELECT 
      l.tipo_local as label,
      ROUND(AVG(e.puntuacion)) as promedio,
      COUNT(e.id) as evaluaciones
    FROM locales l
    LEFT JOIN evaluaciones e ON l.id = e.local_id
    GROUP BY l.tipo_local
    HAVING COUNT(e.id) > 0
    ORDER BY promedio DESC
  `;
  
  db.query(calificacionesSql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Formatear datos para Chart.js
    const chartData = {
      labels: results.map(r => r.label),
      datasets: [
        {
          label: 'Promedio de Calificación',
          data: results.map(r => parseFloat(r.promedio)),
          backgroundColor: [
            '#16697A', // Azul oscuro para Alimentos
            '#489FB5', // Azul medio para Misceláneas
            '#82C0CC', // Azul claro para Taxis
            '#EDE7E3', // Gris claro para Estacionamiento
          ],
          borderColor: [
            '#16697A',
            '#489FB5',
            '#82C0CC',
            '#EDE7E3',
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    };
    
    res.json(chartData);
  });
});

// GET - Evaluaciones por día (últimos 7 días)
router.get('/dashboard/por-dia', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const dias = parseInt(req.query.dias) || 7;
  
  const porDiaSql = `
    SELECT 
      DATE(e.fecha) as fecha,
      COUNT(e.id) as evaluaciones
    FROM evaluaciones e
    WHERE e.fecha >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY DATE(e.fecha)
    ORDER BY fecha
  `;
  
  db.query(porDiaSql, [dias], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Formatear datos para Chart.js
    const chartData = {
      labels: results.map(r => {
        const fecha = new Date(r.fecha);
        return fecha.toLocaleDateString('es-ES', { weekday: 'short' });
      }),
      datasets: [
        {
          label: 'Evaluaciones',
          data: results.map(r => parseInt(r.evaluaciones)),
          fill: true,
          backgroundColor: "rgba(94, 114, 228, 0.1)",
          borderColor: "rgba(94, 114, 228, 1)",
          borderWidth: 2,
          tension: 0.4,
        }
      ]
    };
    
    res.json(chartData);
  });
});

module.exports = router; 