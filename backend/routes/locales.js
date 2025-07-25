const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Obtener todos los locales
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM locales ORDER BY nombre';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error obteniendo locales:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET - Obtener un local específico
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM locales WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error obteniendo local:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Local no encontrado' });
    }
    res.json(results[0]);
  });
});

module.exports = router; 