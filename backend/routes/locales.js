const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole, requireAdmin } = require('./auth');
const db = require('../db');

// GET - Obtener todos los locales (ambos roles pueden ver)
router.get('/', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  console.log('GET / - Obteniendo todos los locales');
  const sql = 'SELECT id, nombre, estatus, tipo_local, token_publico FROM locales ORDER BY nombre';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error obteniendo locales:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Se encontraron ${results.length} locales`);
    res.json(results);
  });
});

// Función para generar token público único
function generarTokenPublico() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 16; i++) {
    token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return token;
}

// POST - Crear un nuevo local (solo administradores)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  console.log('POST / - Creando nuevo local:', req.body);
  const { nombre, estatus, tipo_local } = req.body;
  
  // Validaciones
  if (!nombre || !estatus || !tipo_local) {
    console.log('Error: Campos requeridos faltantes');
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  // Generar token público único
  const tokenPublico = generarTokenPublico();
  
  const sql = 'INSERT INTO locales (nombre, estatus, tipo_local, token_publico) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, estatus, tipo_local, tokenPublico], (err, result) => {
    if (err) {
      console.error('Error creando local:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Local creado con ID:', result.insertId);
    
    // Obtener el local creado
    const newLocalId = result.insertId;
    const selectSql = 'SELECT id, nombre, estatus, tipo_local, token_publico FROM locales WHERE id = ?';
    db.query(selectSql, [newLocalId], (err, results) => {
      if (err) {
        console.error('Error obteniendo local creado:', err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(results[0]);
    });
  });
});

// POST - Generar tokens públicos para locales que no los tengan (solo administradores)
router.post('/generar-tokens', authenticateToken, requireAdmin, (req, res) => {
  console.log('POST /generar-tokens - Generando tokens públicos faltantes');
  
  // Buscar locales sin token público
  const checkSql = 'SELECT id, nombre FROM locales WHERE token_publico IS NULL OR token_publico = ""';
  db.query(checkSql, (err, results) => {
    if (err) {
      console.error('Error buscando locales sin token:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length === 0) {
      return res.json({ message: 'Todos los locales ya tienen tokens públicos' });
    }
    
    console.log(`Generando tokens para ${results.length} locales`);
    
    // Generar tokens para cada local
    let completed = 0;
    const total = results.length;
    
    results.forEach(local => {
      const tokenPublico = generarTokenPublico();
      const updateSql = 'UPDATE locales SET token_publico = ? WHERE id = ?';
      
      db.query(updateSql, [tokenPublico, local.id], (err) => {
        if (err) {
          console.error(`Error actualizando token para local ${local.id}:`, err);
        }
        
        completed++;
        if (completed === total) {
          res.json({ 
            message: `Se generaron tokens para ${total} locales`,
            locales_actualizados: total
          });
        }
      });
    });
  });
});

// GET - Obtener un local específico (ambos roles pueden ver)
router.get('/:id', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const { id } = req.params;
  console.log(`GET /${id} - Obteniendo local específico`);
  const sql = 'SELECT id, nombre, estatus, tipo_local, token_publico FROM locales WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error obteniendo local:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      console.log(`Local con ID ${id} no encontrado`);
      return res.status(404).json({ error: 'Local no encontrado' });
    }
    console.log(`Local encontrado:`, results[0]);
    res.json(results[0]);
  });
});

// PUT - Actualizar un local (solo administradores)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  console.log(`PUT /${id} - Actualizando local:`, req.body);
  const { nombre, estatus, tipo_local } = req.body;
  
  // Validaciones
  if (!nombre || !estatus || !tipo_local) {
    console.log('Error: Campos requeridos faltantes para actualización');
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  const sql = 'UPDATE locales SET nombre = ?, estatus = ?, tipo_local = ? WHERE id = ?';
  db.query(sql, [nombre, estatus, tipo_local, id], (err, result) => {
    if (err) {
      console.error('Error actualizando local:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`Filas afectadas en actualización: ${result.affectedRows}`);
    
    if (result.affectedRows === 0) {
      console.log(`Local con ID ${id} no encontrado para actualización`);
      return res.status(404).json({ error: 'Local no encontrado' });
    }
    
    // Obtener el local actualizado
    const selectSql = 'SELECT id, nombre, estatus, tipo_local, token_publico FROM locales WHERE id = ?';
    db.query(selectSql, [id], (err, results) => {
      if (err) {
        console.error('Error obteniendo local actualizado:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Local actualizado:', results[0]);
      res.json(results[0]);
    });
  });
});

// DELETE - Eliminar un local (solo administradores)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /${id} - Eliminando local`);
  
  const sql = 'DELETE FROM locales WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error eliminando local:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`Filas afectadas en eliminación: ${result.affectedRows}`);
    
    if (result.affectedRows === 0) {
      console.log(`Local con ID ${id} no encontrado para eliminación`);
      return res.status(404).json({ error: 'Local no encontrado' });
    }
    
    res.json({ message: 'Local eliminado exitosamente' });
  });
});

// GET - Obtener un local por token_publico (ambos roles pueden ver)
router.get('/token/:token_publico', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const { token_publico } = req.params;
  const sql = 'SELECT id, nombre, estatus, tipo_local, token_publico FROM locales WHERE token_publico = ?';
  db.query(sql, [token_publico], (err, results) => {
    if (err) {
      console.error('Error obteniendo local por token_publico:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Local no encontrado' });
    }
    res.json(results[0]);
  });
});

// GET - Obtener un local por token_publico (RUTA PÚBLICA para evaluaciones)
router.get('/public/token/:token_publico', (req, res) => {
  const { token_publico } = req.params;
  console.log(`GET /public/token/${token_publico} - Obteniendo local público por token`);
  
  const sql = 'SELECT id, nombre, estatus, tipo_local, token_publico FROM locales WHERE token_publico = ?';
  db.query(sql, [token_publico], (err, results) => {
    if (err) {
      console.error('Error obteniendo local público por token_publico:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      console.log(`Local con token ${token_publico} no encontrado`);
      return res.status(404).json({ error: 'Local no encontrado' });
    }
    console.log(`Local público encontrado:`, results[0]);
    res.json(results[0]);
  });
});

// GET - Obtener locales con evaluaciones y estadísticas (para vista de evaluaciones)
router.get('/evaluaciones/estadisticas', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  console.log('GET /evaluaciones/estadisticas - Obteniendo locales con estadísticas');
  
  const sql = `
    SELECT 
      l.id,
      l.nombre,
      l.tipo_local,
      l.estatus,
      COUNT(e.id) as total_evaluaciones,
      AVG(e.puntuacion) as calificacion_promedio,
      MAX(e.fecha) as ultima_evaluacion,
      COUNT(CASE WHEN e.comentario IS NOT NULL AND e.comentario != '' THEN 1 END) as evaluaciones_con_comentario
    FROM locales l
    INNER JOIN evaluaciones e ON l.id = e.local_id
    WHERE l.estatus = 'activo'
    GROUP BY l.id, l.nombre, l.tipo_local, l.estatus
    HAVING COUNT(e.id) > 0
    ORDER BY l.nombre
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error obteniendo estadísticas de locales:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`Se encontraron ${results.length} locales con estadísticas`);
    
    // Formatear los resultados
    const localesFormateados = results.map(local => ({
      id: local.id,
      nombre: local.nombre,
      tipo: local.tipo_local,
      estatus: local.estatus,
      totalEvaluaciones: local.total_evaluaciones || 0,
      calificacionPromedio: local.calificacion_promedio && !isNaN(local.calificacion_promedio) 
        ? parseFloat(parseFloat(local.calificacion_promedio).toFixed(1)) 
        : 0,
      ultimaEvaluacion: local.ultima_evaluacion ? new Date(local.ultima_evaluacion).toISOString().split('T')[0] : null,
      evaluacionesConComentario: local.evaluaciones_con_comentario || 0
    }));
    
    res.json(localesFormateados);
  });
});

// GET - Debug: Ver todas las respuestas (solo para desarrollo)
router.get('/debug/respuestas', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  console.log('GET /debug/respuestas - Debug de respuestas');
  
  const sql = `
    SELECT 
      r.evaluacion_id,
      r.pregunta,
      r.puntuacion,
      e.local_id,
      l.nombre as nombre_local
    FROM respuestas r
    INNER JOIN evaluaciones e ON r.evaluacion_id = e.id
    INNER JOIN locales l ON e.local_id = l.id
    ORDER BY r.evaluacion_id, r.pregunta
    LIMIT 20
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error en debug de respuestas:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Debug - Respuestas encontradas:', results);
    res.json({
      message: 'Debug de respuestas',
      total: results.length,
      respuestas: results
    });
  });
});

// GET - Obtener respuestas de una evaluación específica
router.get('/evaluacion/:evaluacionId/respuestas', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const { evaluacionId } = req.params;
  console.log(`GET /evaluacion/${evaluacionId}/respuestas - Obteniendo respuestas de la evaluación`);
  
  // Primero verificar que la evaluación existe
  const checkSql = 'SELECT id, local_id FROM evaluaciones WHERE id = ?';
  db.query(checkSql, [evaluacionId], (err, evalResults) => {
    if (err) {
      console.error('Error verificando evaluación:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (evalResults.length === 0) {
      console.log(`Evaluación con ID ${evaluacionId} no encontrada`);
      return res.status(404).json({ error: 'Evaluación no encontrada' });
    }
    
    console.log(`Evaluación encontrada:`, evalResults[0]);
    
    // Debug: Verificar si hay respuestas para esta evaluación
    const debugSql = 'SELECT COUNT(*) as total FROM respuestas WHERE evaluacion_id = ?';
    db.query(debugSql, [evaluacionId], (err, debugResults) => {
      if (err) {
        console.error('Error en debug:', err);
      } else {
        console.log(`Debug: Total de respuestas en BD para evaluación ${evaluacionId}:`, debugResults[0].total);
      }
      
      // Ahora obtener las respuestas
      const sql = `
        SELECT 
          r.pregunta,
          r.puntuacion,
          e.comentario,
          e.fecha,
          l.nombre as nombre_local,
          l.tipo_local
        FROM respuestas r
        INNER JOIN evaluaciones e ON r.evaluacion_id = e.id
        INNER JOIN locales l ON e.local_id = l.id
        WHERE r.evaluacion_id = ?
        ORDER BY r.pregunta
      `;
      
      console.log('Ejecutando consulta SQL:', sql);
      console.log('Parámetros:', [evaluacionId]);
      
      db.query(sql, [evaluacionId], (err, results) => {
        if (err) {
          console.error('Error obteniendo respuestas:', err);
          return res.status(500).json({ error: err.message });
        }
        
        console.log(`Se encontraron ${results.length} respuestas`);
        console.log('Resultados raw:', results);
        
        // Formatear las respuestas
        const respuestasFormateadas = results.map(resp => ({
          pregunta: resp.pregunta,
          puntuacion: resp.puntuacion,
          comentario: resp.comentario,
          fecha: new Date(resp.fecha).toISOString().split('T')[0],
          nombreLocal: resp.nombre_local,
          tipoLocal: resp.tipo_local
        }));
        
        console.log('Respuestas formateadas:', respuestasFormateadas);
        res.json(respuestasFormateadas);
      });
    });
  });
});

// GET - Obtener evaluaciones detalladas de un local específico
router.get('/:id/evaluaciones-detalladas', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const { id } = req.params;
  console.log(`GET /${id}/evaluaciones-detalladas - Obteniendo evaluaciones detalladas del local`);
  
  const sql = `
    SELECT 
      e.id,
      e.puntuacion,
      e.comentario,
      e.fecha,
      l.nombre as nombre_local,
      l.tipo_local
    FROM evaluaciones e
    INNER JOIN locales l ON e.local_id = l.id
    WHERE e.local_id = ?
    ORDER BY e.fecha DESC
  `;
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error obteniendo evaluaciones detalladas:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`Se encontraron ${results.length} evaluaciones detalladas`);
    
    // Formatear las evaluaciones
    const evaluacionesFormateadas = results.map(eval => ({
      id: eval.id,
      calificacion: eval.puntuacion,
      comentario: eval.comentario,
      fecha: new Date(eval.fecha).toISOString().split('T')[0],
      nombreLocal: eval.nombre_local,
      tipoLocal: eval.tipo_local
    }));
    
    res.json(evaluacionesFormateadas);
  });
});


module.exports = router; 