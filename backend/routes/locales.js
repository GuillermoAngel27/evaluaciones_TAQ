const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole, requireAdmin } = require('./auth');
const db = require('../db');

// Función para normalizar tipos de local
const normalizarTipoLocal = (tipo) => {
  if (!tipo) return 'miscelaneas';
  
  const tipoLower = tipo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Mapeo de variantes a valores estándar
  if (tipoLower.includes('miscelanea')) return 'miscelaneas';
  if (tipoLower.includes('alimento')) return 'alimentos';
  if (tipoLower.includes('taxi')) return 'taxis';
  if (tipoLower.includes('estacionamiento') || tipoLower.includes('parking')) return 'estacionamiento';
  
  return 'miscelaneas'; // fallback
};

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
    
    // Normalizar los tipos de local antes de enviar la respuesta
    const localesNormalizados = results.map(local => ({
      ...local,
      tipo_local: normalizarTipoLocal(local.tipo_local)
    }));
    
    res.json(localesNormalizados);
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
      
      // Normalizar el tipo de local antes de enviar la respuesta
      const localNormalizado = {
        ...results[0],
        tipo_local: normalizarTipoLocal(results[0].tipo_local)
      };
      
      res.status(201).json(localNormalizado);
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

// GET - Obtener promedios por pregunta por tipo de local
router.get('/promedios-por-pregunta/:tipoLocal', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  console.log('GET /promedios-por-pregunta/:tipoLocal - Obteniendo promedios por pregunta');
  
  const { tipoLocal } = req.params;
  const tipoNormalizado = normalizarTipoLocal(tipoLocal);
  
  // Obtener todas las preguntas del tipo de local
  const { PREGUNTAS_POR_TIPO } = require('../config/preguntas.js');
  const preguntasTipo = PREGUNTAS_POR_TIPO[tipoNormalizado] || [];
  
  if (preguntasTipo.length === 0) {
    return res.status(400).json({ error: 'Tipo de local no válido' });
  }
  
  // Crear consulta para obtener promedios de todas las preguntas
  const numerosPreguntas = Array.from({ length: preguntasTipo.length }, (_, i) => i + 1);
  const placeholders = numerosPreguntas.map(() => '?').join(',');
  
  const sql = `
    SELECT 
      r.pregunta as numero_pregunta,
      AVG(r.puntuacion) as promedio,
      COUNT(*) as total_respuestas
    FROM respuestas r
    INNER JOIN evaluaciones e ON r.evaluacion_id = e.id
    INNER JOIN locales l ON e.local_id = l.id
    WHERE l.estatus = 'activo' 
    AND l.tipo_local = ? 
    AND r.pregunta IN (${placeholders})
    GROUP BY r.pregunta
    ORDER BY r.pregunta ASC
  `;
  
  const params = [tipoNormalizado, ...numerosPreguntas];
  
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error obteniendo promedios por pregunta:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Crear mapa de resultados
    const promediosMap = {};
    results.forEach(item => {
      promediosMap[item.numero_pregunta] = {
        promedio: parseInt(Math.round(parseFloat(item.promedio || 0))),
        totalRespuestas: item.total_respuestas || 0
      };
    });
    
    // Crear array con todas las preguntas, incluyendo las que no tienen datos
    const { numeroATextoPregunta } = require('../config/preguntas.js');
    const promediosCompletos = numerosPreguntas.map(numero => {
      const datos = promediosMap[numero] || { promedio: 0, totalRespuestas: 0 };
      return {
        numero: numero,
        pregunta: numeroATextoPregunta(numero, tipoNormalizado) || `Pregunta ${numero}`,
        promedio: datos.promedio,
        totalRespuestas: datos.totalRespuestas
      };
    });
    
    console.log(`Se obtuvieron promedios para ${promediosCompletos.length} preguntas del tipo ${tipoNormalizado}`);
    res.json(promediosCompletos);
  });
});

// GET - Obtener insights de evaluación (reemplaza respuestas-por-pregunta)
router.get('/insights-evaluacion', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  console.log('GET /insights-evaluacion - Obteniendo insights de evaluación');
  
  // 1. Obtener estado general del sistema
  const sqlEstadoGeneral = `
    SELECT 
      AVG(r.puntuacion) as promedio_general,
      COUNT(*) as total_evaluaciones,
      SUM(CASE WHEN r.puntuacion >= 4 THEN 1 ELSE 0 END) as satisfechos,
      SUM(CASE WHEN r.puntuacion = 3 THEN 1 ELSE 0 END) as regulares,
      SUM(CASE WHEN r.puntuacion <= 2 THEN 1 ELSE 0 END) as insatisfechos
    FROM respuestas r
    INNER JOIN evaluaciones e ON r.evaluacion_id = e.id
    INNER JOIN locales l ON e.local_id = l.id
    WHERE l.estatus = 'activo'
  `;
  
  // 2. Obtener áreas que necesitan atención (preguntas con calificación < 3.5)
  const sqlAreasProblema = `
    SELECT 
      r.pregunta as numero_pregunta,
      l.tipo_local,
      AVG(r.puntuacion) as promedio,
      COUNT(*) as total_respuestas,
      SUM(CASE WHEN r.puntuacion <= 2 THEN 1 ELSE 0 END) as insatisfechos
    FROM respuestas r
    INNER JOIN evaluaciones e ON r.evaluacion_id = e.id
    INNER JOIN locales l ON e.local_id = l.id
    WHERE l.estatus = 'activo'
    GROUP BY r.pregunta, l.tipo_local
    HAVING AVG(r.puntuacion) < 3.5
    ORDER BY AVG(r.puntuacion) ASC
    LIMIT 5
  `;
  
  // 3. Obtener mejores prácticas (preguntas con calificación > 4.5)
  const sqlMejoresPracticas = `
    SELECT 
      r.pregunta as numero_pregunta,
      l.tipo_local,
      AVG(r.puntuacion) as promedio,
      COUNT(*) as total_respuestas,
      SUM(CASE WHEN r.puntuacion >= 4 THEN 1 ELSE 0 END) as satisfechos
    FROM respuestas r
    INNER JOIN evaluaciones e ON r.evaluacion_id = e.id
    INNER JOIN locales l ON e.local_id = l.id
    WHERE l.estatus = 'activo'
    GROUP BY r.pregunta, l.tipo_local
    HAVING AVG(r.puntuacion) > 4.5
    ORDER BY AVG(r.puntuacion) DESC
    LIMIT 5
  `;
  
  // 4. Obtener tendencias por tipo de local
  const sqlTendencias = `
    SELECT 
      l.tipo_local,
      AVG(r.puntuacion) as promedio,
      COUNT(*) as total_evaluaciones
    FROM respuestas r
    INNER JOIN evaluaciones e ON r.evaluacion_id = e.id
    INNER JOIN locales l ON e.local_id = l.id
    WHERE l.estatus = 'activo'
    GROUP BY l.tipo_local
    ORDER BY AVG(r.puntuacion) DESC
  `;
  
  // Ejecutar todas las consultas
  db.query(sqlEstadoGeneral, (err, estadoGeneral) => {
    if (err) {
      console.error('Error obteniendo estado general:', err);
      return res.status(500).json({ error: err.message });
    }
    
    db.query(sqlAreasProblema, (err, areasProblema) => {
      if (err) {
        console.error('Error obteniendo áreas problema:', err);
        return res.status(500).json({ error: err.message });
      }
      
      db.query(sqlMejoresPracticas, (err, mejoresPracticas) => {
        if (err) {
          console.error('Error obteniendo mejores prácticas:', err);
          return res.status(500).json({ error: err.message });
        }
        
        db.query(sqlTendencias, (err, tendencias) => {
          if (err) {
            console.error('Error obteniendo tendencias:', err);
            return res.status(500).json({ error: err.message });
          }
          
          // Procesar y formatear los datos
          const { numeroATextoPregunta } = require('../config/preguntas.js');
          
                     // Formatear estado general
           const estado = estadoGeneral[0];
           const insights = {
             estadoGeneral: {
               promedio: parseInt(Math.round(parseFloat(estado.promedio_general || 0))),
               totalEvaluaciones: estado.total_evaluaciones || 0,
               porcentajeSatisfaccion: estado.total_evaluaciones ? 
                 Math.round((estado.satisfechos / estado.total_evaluaciones) * 100) : 0,
               porcentajeRegular: estado.total_evaluaciones ? 
                 Math.round((estado.regulares / estado.total_evaluaciones) * 100) : 0,
               porcentajeInsatisfaccion: estado.total_evaluaciones ? 
                 Math.round((estado.insatisfechos / estado.total_evaluaciones) * 100) : 0
             },
            
                         areasProblema: areasProblema.map(item => ({
               pregunta: numeroATextoPregunta(item.numero_pregunta, item.tipo_local) || `Pregunta ${item.numero_pregunta}`,
               tipoLocal: item.tipo_local,
               promedio: parseInt(Math.round(parseFloat(item.promedio))),
               totalRespuestas: item.total_respuestas,
               porcentajeInsatisfaccion: Math.round((item.insatisfechos / item.total_respuestas) * 100)
             })),
             
             mejoresPracticas: mejoresPracticas.map(item => ({
               pregunta: numeroATextoPregunta(item.numero_pregunta, item.tipo_local) || `Pregunta ${item.numero_pregunta}`,
               tipoLocal: item.tipo_local,
               promedio: parseInt(Math.round(parseFloat(item.promedio))),
               totalRespuestas: item.total_respuestas,
               porcentajeSatisfaccion: Math.round((item.satisfechos / item.total_respuestas) * 100)
             })),
             
             tendencias: tendencias.map(item => ({
               tipoLocal: item.tipo_local,
               promedio: parseInt(Math.round(parseFloat(item.promedio))),
               totalEvaluaciones: item.total_evaluaciones
             }))
          };
          
          console.log('Insights generados exitosamente');
          res.json(insights);
        });
      });
    });
  });
});

// GET - Obtener respuestas por pregunta específica (mantener para compatibilidad)
router.get('/respuestas-por-pregunta', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  console.log('GET /respuestas-por-pregunta - Obteniendo respuestas por pregunta específica');
  console.log('Query params:', req.query);
  
  const { pregunta, tipo_local, fechaDesde, fechaHasta } = req.query;
  
  if (!pregunta || !tipo_local || tipo_local === 'all') {
    return res.status(400).json({ error: 'Los parámetros "pregunta" y "tipo_local" son requeridos' });
  }
  
  // Importar funciones de mapeo
  const { textoPreguntaANumero, numeroATextoPregunta } = require('../config/preguntas.js');
  
  // Convertir texto de pregunta a número
  const numeroPregunta = textoPreguntaANumero(pregunta, tipo_local);
  if (!numeroPregunta) {
    return res.status(400).json({ 
      error: 'Pregunta no válida para el tipo de local especificado',
      pregunta: pregunta,
      tipo_local: tipo_local
    });
  }
  
  console.log(`Pregunta "${pregunta}" convertida a número: ${numeroPregunta}`);
  
  let sql = `
    SELECT 
      l.nombre as nombre_local,
      r.puntuacion,
      e.comentario,
      e.fecha,
      e.turno,
      r.pregunta as numero_pregunta
    FROM respuestas r
    INNER JOIN evaluaciones e ON r.evaluacion_id = e.id
    INNER JOIN locales l ON e.local_id = l.id
    WHERE r.pregunta = ?
    AND l.tipo_local = ?
    AND l.estatus = 'activo'
  `;
  
  let params = [numeroPregunta, tipo_local];
  
  // Agregar filtros de fecha si están presentes
  if (fechaDesde || fechaHasta) {
    if (fechaDesde && fechaHasta) {
      sql += ` AND DATE(e.fecha) BETWEEN ? AND ?`;
      params.push(fechaDesde, fechaHasta);
    } else if (fechaDesde) {
      sql += ` AND DATE(e.fecha) >= ?`;
      params.push(fechaDesde);
    } else if (fechaHasta) {
      sql += ` AND DATE(e.fecha) <= ?`;
      params.push(fechaHasta);
    }
  }
  
  sql += ` ORDER BY e.fecha DESC`;
  
  console.log('SQL:', sql);
  console.log('Params:', params);
  
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error obteniendo respuestas por pregunta:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`Se encontraron ${results.length} respuestas para la pregunta: "${pregunta}" (número: ${numeroPregunta})`);
    
    // Formatear los resultados
    const respuestasFormateadas = results.map(respuesta => ({
      nombre_local: respuesta.nombre_local,
      puntuacion: respuesta.puntuacion,
      comentario: respuesta.comentario,
      fecha: respuesta.fecha ? 
        (typeof respuesta.fecha === 'string' ? 
          respuesta.fecha : 
          respuesta.fecha.toISOString().replace('T', ' ').split('.')[0]
        ) : null,
      turno: respuesta.turno,
      pregunta_texto: pregunta, // Mantener el texto original
      pregunta_numero: respuesta.numero_pregunta
    }));
    
    res.json(respuestasFormateadas);
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
    
    // Normalizar el tipo de local antes de enviar la respuesta
    const localNormalizado = {
      ...results[0],
      tipo_local: normalizarTipoLocal(results[0].tipo_local)
    };
    
    console.log(`Local encontrado:`, localNormalizado);
    res.json(localNormalizado);
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
      
      // Normalizar el tipo de local antes de enviar la respuesta
      const localNormalizado = {
        ...results[0],
        tipo_local: normalizarTipoLocal(results[0].tipo_local)
      };
      
      console.log('Local actualizado:', localNormalizado);
      res.json(localNormalizado);
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
    
    // Normalizar el tipo de local antes de enviar la respuesta
    const localNormalizado = {
      ...results[0],
      tipo_local: normalizarTipoLocal(results[0].tipo_local)
    };
    
    res.json(localNormalizado);
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
    
    // Normalizar el tipo de local antes de enviar la respuesta
    const localNormalizado = {
      ...results[0],
      tipo_local: normalizarTipoLocal(results[0].tipo_local)
    };
    
    console.log(`Local público encontrado:`, localNormalizado);
    res.json(localNormalizado);
  });
});

// GET - Obtener locales con evaluaciones y estadísticas (para vista de evaluaciones)
router.get('/evaluaciones/estadisticas', authenticateToken, requireRole(['administrador', 'normal']), (req, res) => {
  console.log('GET /evaluaciones/estadisticas - Obteniendo locales con estadísticas');
  console.log('Query params:', req.query);
  
  const { fechaDesde, fechaHasta } = req.query;
  
  let sql = `
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
  `;
  
  // Agregar filtros de fecha si están presentes
  if (fechaDesde || fechaHasta) {
    if (fechaDesde && fechaHasta) {
      sql += ` AND DATE(e.fecha) BETWEEN ? AND ?`;
    } else if (fechaDesde) {
      sql += ` AND DATE(e.fecha) >= ?`;
    } else if (fechaHasta) {
      sql += ` AND DATE(e.fecha) <= ?`;
    }
  }
  
  sql += `
    GROUP BY l.id, l.nombre, l.tipo_local, l.estatus
    HAVING COUNT(e.id) > 0
    ORDER BY l.nombre
  `;
  
  // Preparar parámetros para la consulta
  let params = [];
  if (fechaDesde && fechaHasta) {
    params = [fechaDesde, fechaHasta];
  } else if (fechaDesde) {
    params = [fechaDesde];
  } else if (fechaHasta) {
    params = [fechaHasta];
  }
  
  console.log('SQL:', sql);
  console.log('Params:', params);
  
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error obteniendo estadísticas de locales:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`Se encontraron ${results.length} locales con estadísticas`);
    console.log('Datos raw de la BD:', results.map(r => ({
      id: r.id,
      nombre: r.nombre,
      ultima_evaluacion: r.ultima_evaluacion
    })));
    
    // Formatear los resultados
    const localesFormateados = results.map(local => {
      const ultimaEvaluacion = local.ultima_evaluacion ? 
        (typeof local.ultima_evaluacion === 'string' ? 
          local.ultima_evaluacion : 
          local.ultima_evaluacion.toISOString().replace('T', ' ').split('.')[0]
        ) : null;
      console.log(`Local ${local.nombre}: ${local.ultima_evaluacion} -> ${ultimaEvaluacion}`);
      
      return {
        id: local.id,
        nombre: local.nombre,
        tipo: normalizarTipoLocal(local.tipo_local),
        estatus: local.estatus,
        totalEvaluaciones: local.total_evaluaciones || 0,
        calificacionPromedio: local.calificacion_promedio && !isNaN(local.calificacion_promedio) 
          ? parseFloat(parseFloat(local.calificacion_promedio).toFixed(1)) 
          : 0,
        ultimaEvaluacion: ultimaEvaluacion,
        evaluacionesConComentario: local.evaluaciones_con_comentario || 0
      };
    });
    
    console.log('Datos formateados enviados:', localesFormateados.map(l => ({
      nombre: l.nombre,
      ultimaEvaluacion: l.ultimaEvaluacion
    })));
    
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
          fecha: typeof resp.fecha === 'string' ? 
            resp.fecha : 
            resp.fecha.toISOString().replace('T', ' ').split('.')[0],
          nombreLocal: resp.nombre_local,
          tipoLocal: normalizarTipoLocal(resp.tipo_local)
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
  const { fechaDesde, fechaHasta } = req.query;
  console.log(`GET /${id}/evaluaciones-detalladas - Obteniendo evaluaciones detalladas del local`);
  console.log('Query params:', req.query);
  
  let sql = `
    SELECT 
      e.id,
      e.puntuacion,
      e.comentario,
      e.fecha,
      e.turno,
      l.nombre as nombre_local,
      l.tipo_local
    FROM evaluaciones e
    INNER JOIN locales l ON e.local_id = l.id
    WHERE e.local_id = ?
  `;
  
  // Agregar filtros de fecha si están presentes
  if (fechaDesde || fechaHasta) {
    if (fechaDesde && fechaHasta) {
      sql += ` AND DATE(e.fecha) BETWEEN ? AND ?`;
    } else if (fechaDesde) {
      sql += ` AND DATE(e.fecha) >= ?`;
    } else if (fechaHasta) {
      sql += ` AND DATE(e.fecha) <= ?`;
    }
  }
  
  sql += ` ORDER BY e.fecha DESC`;
  
  // Preparar parámetros para la consulta
  let params = [id];
  if (fechaDesde && fechaHasta) {
    params.push(fechaDesde, fechaHasta);
  } else if (fechaDesde) {
    params.push(fechaDesde);
  } else if (fechaHasta) {
    params.push(fechaHasta);
  }
  
  console.log('SQL:', sql);
  console.log('Params:', params);
  
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error obteniendo evaluaciones detalladas:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`Se encontraron ${results.length} evaluaciones detalladas`);
    
    // Función para determinar el turno específico basado en la hora
    const determinarTurnoEspecifico = (turno, fecha) => {
      if (turno !== 3) return turno.toString();
      
      const hora = new Date(fecha).getHours();
      const minutos = new Date(fecha).getMinutes();
      const segundos = new Date(fecha).getSeconds();
      const horaString = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
      
      // Determinar cuál de los dos turnos 3 corresponde
      if (horaString >= '00:00:00' && horaString <= '05:30:00') {
        return '3-madrugada';
      } else if (horaString >= '21:00:01' && horaString <= '23:59:59') {
        return '3-noche';
      }
      
      return '3'; // Fallback
    };

    // Formatear las evaluaciones
    const evaluacionesFormateadas = results.map(eval => ({
      id: eval.id,
      calificacion: eval.puntuacion,
      comentario: eval.comentario,
      fecha: typeof eval.fecha === 'string' ? 
        eval.fecha : 
        eval.fecha.toISOString().replace('T', ' ').split('.')[0],
      turno: parseInt(eval.turno) || 1, // Convertir a número
      turno_especifico: determinarTurnoEspecifico(parseInt(eval.turno) || 1, eval.fecha),
      nombreLocal: eval.nombre_local,
      tipoLocal: normalizarTipoLocal(eval.tipo_local)
    }));
    
    res.json(evaluacionesFormateadas);
  });
});

module.exports = router; 