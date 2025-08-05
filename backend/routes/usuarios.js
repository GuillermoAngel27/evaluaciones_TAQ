const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { authenticateToken, requireAdmin, requireRole } = require('./auth');
const db = require('../db');

// GET /api/usuarios - Obtener todos los usuarios (solo admin)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const sql = 'SELECT id, username, nombre, apellido, rol, activo, fecha_creacion, fecha_actualizacion FROM usuarios ORDER BY fecha_creacion DESC';
    
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      
      res.json({
        success: true,
        usuarios: results
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



// GET /api/usuarios/:id - Obtener usuario por ID (solo admin)
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = 'SELECT id, username, nombre, apellido, rol, activo, fecha_creacion, fecha_actualizacion, password FROM usuarios WHERE id = ?';
    
    db.query(sql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({
        success: true,
        usuario: results[0]
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/usuarios - Crear nuevo usuario (solo admin)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, password, nombre, apellido, rol } = req.body;
    
    // Validaciones
    if (!username || !password || !nombre || !apellido || !rol) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    if (!['administrador', 'normal'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido. Debe ser "administrador" o "normal"' });
    }
    
    // Verificar si el username ya existe
    const checkSql = 'SELECT id FROM usuarios WHERE username = ?';
    db.query(checkSql, [username], async (checkErr, checkResults) => {
      if (checkErr) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      
      if (checkResults.length > 0) {
        return res.status(400).json({ error: 'El username ya existe' });
      }
      
      // Hashear contraseña
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insertar nuevo usuario
        const insertSql = 'INSERT INTO usuarios (username, password, nombre, apellido, rol) VALUES (?, ?, ?, ?, ?)';
        db.query(insertSql, [username, hashedPassword, nombre, apellido, rol], (insertErr, insertResult) => {
          if (insertErr) {
            return res.status(500).json({ error: 'Error interno del servidor' });
          }
          
          res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            usuario: {
              id: insertResult.insertId,
              username,
              nombre,
              apellido,
              rol
            }
          });
        });
      } catch (hashError) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/usuarios/:id - Actualizar usuario (solo admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, nombre, apellido, rol, activo } = req.body;
    
    // Validaciones
    if (!username || !nombre || !apellido || !rol) {
      return res.status(400).json({ error: 'Username, nombre, apellido y rol son requeridos' });
    }
    
    if (!['administrador', 'normal'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido. Debe ser "administrador" o "normal"' });
    }
    
    // Verificar si el usuario existe
    const checkSql = 'SELECT id FROM usuarios WHERE id = ?';
    db.query(checkSql, [id], (checkErr, checkResults) => {
      if (checkErr) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      
      if (checkResults.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      // Verificar si el username ya existe en otro usuario
      const usernameCheckSql = 'SELECT id FROM usuarios WHERE username = ? AND id != ?';
              db.query(usernameCheckSql, [username, id], (usernameErr, usernameResults) => {
          if (usernameErr) {
            return res.status(500).json({ error: 'Error interno del servidor' });
          }
        
        if (usernameResults.length > 0) {
          return res.status(400).json({ error: 'El username ya existe' });
        }
        
        // Actualizar usuario
        const updateSql = 'UPDATE usuarios SET username = ?, nombre = ?, apellido = ?, rol = ?, activo = ?, fecha_actualizacion = NOW() WHERE id = ?';
        db.query(updateSql, [username, nombre, apellido, rol, activo, id], (updateErr, updateResult) => {
          if (updateErr) {
            return res.status(500).json({ error: 'Error interno del servidor' });
          }
          
          res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            usuario: {
              id: parseInt(id),
              username,
              nombre,
              apellido,
              rol,
              activo
            }
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/usuarios/:id/password - Cambiar contraseña de usuario (solo admin)
router.put('/:id/password', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ error: 'Nueva contraseña es requerida' });
    }
    
    // Verificar si el usuario existe
    const checkSql = 'SELECT id FROM usuarios WHERE id = ?';
    db.query(checkSql, [id], async (checkErr, checkResults) => {
      if (checkErr) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      
      if (checkResults.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      // Hashear nueva contraseña
      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Actualizar contraseña
        const updateSql = 'UPDATE usuarios SET password = ?, fecha_actualizacion = NOW() WHERE id = ?';
        db.query(updateSql, [hashedPassword, id], (updateErr, updateResult) => {
          if (updateErr) {
            return res.status(500).json({ error: 'Error interno del servidor' });
          }
          
          res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
          });
        });
      } catch (hashError) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/usuarios/:id - Eliminar usuario físicamente (solo admin)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el usuario existe
    const checkSql = 'SELECT id, username FROM usuarios WHERE id = ?';
    db.query(checkSql, [id], (checkErr, checkResults) => {
      if (checkErr) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      
      if (checkResults.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const usuario = checkResults[0];
      
      // Eliminar usuario físicamente
      const deleteSql = 'DELETE FROM usuarios WHERE id = ?';
      db.query(deleteSql, [id], (deleteErr, deleteResult) => {
        if (deleteErr) {
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        
        res.json({
          success: true,
          message: 'Usuario eliminado exitosamente',
          usuario: {
            id: parseInt(id),
            username: usuario.username
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



module.exports = router; 