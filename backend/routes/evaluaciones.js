const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole, requireAdmin } = require('./auth');
const db = require('../db');

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
      console.error('Error obteniendo evaluaciones:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET - Obtener preguntas por tipo de local (ambos roles pueden ver)
router.get('/preguntas/:tipo', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const { tipo } = req.params;
  
  try {
    console.log('Tipo de local recibido:', tipo);
    
    // Usar la configuración de preguntas del archivo config
    const { obtenerPreguntas, normalizarTipoLocal } = require('../config/preguntas');
    
    const tipoNormalizado = normalizarTipoLocal(tipo);
    console.log('Tipo normalizado:', tipoNormalizado);
    
    const preguntas = obtenerPreguntas(tipo);
    console.log('Preguntas obtenidas:', preguntas);
    
    // Asegurar que la respuesta tenga el formato correcto
    if (!Array.isArray(preguntas) || preguntas.length === 0) {
      console.log('No se encontraron preguntas, usando fallback');
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
    console.error('Error obteniendo preguntas:', error);
    return res.status(500).json({ error: error.message });
  }
});

// GET - Obtener una evaluación específica (ambos roles pueden ver)
router.get('/:id', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM evaluaciones WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error obteniendo evaluación:', err);
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
      console.error('Error obteniendo respuestas:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// POST - Crear una nueva evaluación (sin autenticación - para evaluación pública)
router.post('/', (req, res) => {
  const { token, device_id, respuestas, preguntas, comentario } = req.body;
  
  if (!token || !device_id || !respuestas || !preguntas) {
    return res.status(400).json({ error: 'Token, device_id, respuestas y preguntas son obligatorios' });
  }
  
  // Verificar que el token existe y no ha sido usado
  const tokenSql = 'SELECT * FROM tokens WHERE token = ? AND device_id = ? AND usado = 0';
  db.query(tokenSql, [token, device_id], (err, tokenResults) => {
    if (err) {
      console.error('Error verificando token:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (tokenResults.length === 0) {
      return res.status(400).json({ error: 'Token inválido o ya usado' });
    }
    
    const tokenInfo = tokenResults[0];
    const local_id = tokenInfo.local_id;
    
    // Calcular puntuación promedio
    const puntuacion = respuestas.reduce((sum, val) => sum + val, 0) / respuestas.length;
    
    // Insertar evaluación
    const evalSql = 'INSERT INTO evaluaciones (local_id, puntuacion, comentario, fecha) VALUES (?, ?, ?, NOW())';
    db.query(evalSql, [local_id, puntuacion, comentario || null], (err, evalResult) => {
      if (err) {
        console.error('Error creando evaluación:', err);
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
          console.error('Error insertando respuestas:', err);
          return res.status(500).json({ error: err.message });
        }
        
        // Marcar token como usado
        const updateTokenSql = 'UPDATE tokens SET usado = 1, fecha_usado = NOW() WHERE token = ? AND device_id = ?';
        db.query(updateTokenSql, [token, device_id], (err) => {
          if (err) {
            console.error('Error marcando token como usado:', err);
          }
          
          res.status(201).json({
            id: evaluacion_id,
            local_id,
            puntuacion,
            comentario,
            message: 'Evaluación creada correctamente'
          });
        });
      });
    });
  });
});

// DELETE - Eliminar una evaluación (solo administradores)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  
  // Eliminar respuestas primero
  const deleteRespuestasSql = 'DELETE FROM respuestas WHERE evaluacion_id = ?';
  db.query(deleteRespuestasSql, [id], (err) => {
    if (err) {
      console.error('Error eliminando respuestas:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Eliminar evaluación
    const deleteEvalSql = 'DELETE FROM evaluaciones WHERE id = ?';
    db.query(deleteEvalSql, [id], (err, result) => {
      if (err) {
        console.error('Error eliminando evaluación:', err);
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Evaluación no encontrada' });
      }
      res.json({ message: 'Evaluación eliminada correctamente' });
    });
  });
});

module.exports = router; 