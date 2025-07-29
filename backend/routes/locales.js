const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Obtener todos los locales
router.get('/', (req, res) => {
  console.log('GET / - Obteniendo todos los locales');
  const sql = 'SELECT id, nombre, estatus, tipo_local FROM locales ORDER BY nombre';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error obteniendo locales:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Se encontraron ${results.length} locales`);
    res.json(results);
  });
});

// POST - Crear un nuevo local
router.post('/', (req, res) => {
  console.log('POST / - Creando nuevo local:', req.body);
  const { nombre, estatus, tipo_local } = req.body;
  
  // Validaciones
  if (!nombre || !estatus || !tipo_local) {
    console.log('Error: Campos requeridos faltantes');
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  const sql = 'INSERT INTO locales (nombre, estatus, tipo_local) VALUES (?, ?, ?)';
  db.query(sql, [nombre, estatus, tipo_local], (err, result) => {
    if (err) {
      console.error('Error creando local:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Local creado con ID:', result.insertId);
    
    // Obtener el local creado
    const newLocalId = result.insertId;
    const selectSql = 'SELECT id, nombre, estatus, tipo_local FROM locales WHERE id = ?';
    db.query(selectSql, [newLocalId], (err, results) => {
      if (err) {
        console.error('Error obteniendo local creado:', err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(results[0]);
    });
  });
});

// GET - Obtener un local específico
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`GET /${id} - Obteniendo local específico`);
  const sql = 'SELECT id, nombre, estatus, tipo_local FROM locales WHERE id = ?';
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

// PUT - Actualizar un local
router.put('/:id', (req, res) => {
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
    const selectSql = 'SELECT id, nombre, estatus, tipo_local FROM locales WHERE id = ?';
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

// DELETE - Eliminar un local
router.delete('/:id', (req, res) => {
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

module.exports = router; 