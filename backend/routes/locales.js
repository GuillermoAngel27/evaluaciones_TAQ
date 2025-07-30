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

module.exports = router; 