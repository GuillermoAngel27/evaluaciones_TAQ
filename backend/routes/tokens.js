const express = require('express');
const router = express.Router();
const db = require('../db');

// Generar token de 1 día para un local (evitando duplicados)
router.post('/generar', (req, res) => {
  const { local_id, device_id } = req.body;
  if (!local_id || !device_id) {
    return res.status(400).json({ error: 'local_id y device_id son requeridos' });
  }

  // Generar token aleatorio
  function generarTokenAleatorio() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 9; i++) {
      token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return token;
  }

  // Buscar el último token para este local y dispositivo
  const checkSql = `
    SELECT * FROM tokens 
    WHERE local_id = ? AND device_id = ? 
    ORDER BY fecha_generado DESC
    LIMIT 1
  `;
  db.query(checkSql, [local_id, device_id], (err, existingTokens) => {
    if (err) {
      console.error('Error verificando tokens existentes:', err);
      return res.status(500).json({ error: err.message });
    }

    const nuevoToken = generarTokenAleatorio();
    const nuevaFechaGenerado = new Date();
    const nuevaFechaExpiracion = new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (existingTokens.length > 0) {
      // Actualiza el registro existente
      const existingToken = existingTokens[0];
      const updateSql = `UPDATE tokens SET token = ?, usado = 0, fecha_generado = ?, fecha_expiracion = ?, fecha_usado = NULL WHERE id = ?`;
      db.query(updateSql, [nuevoToken, nuevaFechaGenerado, nuevaFechaExpiracion, existingToken.id], (err2) => {
        if (err2) {
          console.error('Error actualizando token:', err2);
          return res.status(500).json({ error: err2.message });
        }
        return res.json({
          success: true,
          token: nuevoToken,
          local_id: local_id,
          device_id: device_id,
          fecha_generado: nuevaFechaGenerado,
          expira_en: nuevaFechaExpiracion,
          message: 'Token actualizado'
        });
      });
      return;
    }

    // Si no existe ningún token, inserta uno nuevo
    const insertSql = `
      INSERT INTO tokens (token, local_id, device_id, usado, fecha_generado, fecha_expiracion) 
      VALUES (?, ?, ?, 0, NOW(), ?)
    `;
    db.query(insertSql, [nuevoToken, local_id, device_id, nuevaFechaExpiracion], (err, result) => {
      if (err) {
        console.error('Error insertando token:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        success: true,
        token: nuevoToken,
        local_id: local_id,
        device_id: device_id,
        fecha_generado: nuevaFechaGenerado,
        expira_en: nuevaFechaExpiracion,
        message: 'Token generado exitosamente'
      });
    });
  });
});

// Verificar si el usuario puede evaluar (no ha evaluado en las últimas 24 horas)
router.post('/verificar-evaluacion', (req, res) => {
  const { local_id, device_id } = req.body;
  if (!local_id || !device_id) {
    return res.status(400).json({ error: 'local_id y device_id son requeridos' });
  }

  const sql = `
    SELECT * FROM tokens
    WHERE local_id = ? AND device_id = ?
    ORDER BY fecha_generado DESC
    LIMIT 1
  `;
  db.query(sql, [local_id, device_id], (err, results) => {
    if (err) {
      console.error('Error verificando evaluación:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      // No hay tokens previos, puede evaluar
      return res.json({
        puede_evaluar: true,
        mensaje: 'Puede realizar la evaluación'
      });
    }
    const ultimoToken = results[0];
    const expirado = new Date(ultimoToken.fecha_expiracion) < new Date();
    if (expirado) {
      // Si el token está expirado, puede evaluar
      return res.json({
        puede_evaluar: true,
        mensaje: 'Puede realizar la evaluación'
      });
    } else {
      // Si el token NO ha expirado, NO puede evaluar (sin importar si está usado o no)
      return res.json({
        puede_evaluar: false,
        mensaje: 'Ya realizó la evaluación. Podrá volver a evaluar después de 24 horas.'
      });
    }
  });
});

// Marcar token como usado solo si no ha pasado más de un día desde su generación
router.post('/usar', (req, res) => {
  const { token, device_id } = req.body;
  if (!token || !device_id) {
    return res.status(400).json({ error: 'token y device_id son requeridos' });
  }
  // Buscar el token
  const sql = 'SELECT * FROM tokens WHERE token = ? AND device_id = ?';
  db.query(sql, [token, device_id], (err, results) => {
    if (err) {
      console.error('Error buscando token:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Token no encontrado' });
    }
    const tokenInfo = results[0];
    const fechaGenerado = new Date(tokenInfo.fecha_generado);
    const ahora = new Date();
    const unDiaMs = 24 * 60 * 60 * 1000;
    if (ahora - fechaGenerado > unDiaMs) {
      return res.status(400).json({ error: 'El token ha expirado y no puede ser usado.' });
    }
    // Marcar como usado
    const updateSql = 'UPDATE tokens SET usado = 1, fecha_usado = NOW() WHERE token = ? AND device_id = ?';
    db.query(updateSql, [token, device_id], (err2, result) => {
      if (err2) {
        console.error('Error marcando token como usado:', err2);
        return res.status(500).json({ error: err2.message });
      }
      res.json({ success: true, message: 'Token marcado como usado exitosamente' });
    });
  });
});

module.exports = router; 