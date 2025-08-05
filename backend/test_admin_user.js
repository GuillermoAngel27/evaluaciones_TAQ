require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Crear conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'evaluaciones_taq',
  port: process.env.DB_PORT || 3306
});

// Función para crear usuario admin si no existe
const createAdminUser = async () => {
  try {
    // Verificar si el usuario admin ya existe
    const checkSql = 'SELECT id, username, rol FROM usuarios WHERE username = ?';
    db.query(checkSql, ['admin'], (err, results) => {
      if (err) {
        return;
      }

      if (results.length > 0) {
        return;
      }
      
      // Si no existe, crear el usuario admin
      const hashedPassword = bcrypt.hashSync('admin2025', 10);
      const insertSql = `
        INSERT INTO usuarios (username, password, nombre, apellido, rol, activo) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      db.query(insertSql, [
        'admin',
        hashedPassword,
        'Administrador',
        'Sistema',
        'administrador',
        1
      ], (insertErr, insertResults) => {
        // Usuario admin creado o error silencioso
      });
    });
  } catch (error) {
    // Error silencioso
  }
};

// Conectar a la base de datos y ejecutar la función
db.connect((err) => {
  if (err) {
    process.exit(1);
  } else {
    createAdminUser();
    
    // Cerrar conexión después de 3 segundos
    setTimeout(() => {
      db.end();
      process.exit(0);
    }, 3000);
  }
}); 