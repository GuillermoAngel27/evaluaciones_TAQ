const bcrypt = require('bcrypt');
const mysql = require('mysql2');
require('dotenv').config();

// Crear conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'evaluaciones',
  port: process.env.DB_PORT || 3306
});

// Función para generar contraseña hasheada
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Función para actualizar contraseñas de usuarios
async function updateUserPasswords() {
  try {
    console.log('🔐 Generando contraseñas hasheadas...\n');

    // Definir las contraseñas para cada rol
    const passwords = {
      'admin': 'admin123',
      'supervisor1': 'supervisor123',
      'supervisor2': 'supervisor123',
      'evaluador1': 'evaluador123',
      'evaluador2': 'evaluador123',
      'evaluador3': 'evaluador123',
      'viewer1': 'viewer123',
      'viewer2': 'viewer123'
    };

    for (const [username, password] of Object.entries(passwords)) {
      const hashedPassword = await hashPassword(password);
      
      const updateSql = 'UPDATE usuarios SET password = ? WHERE username = ?';
      
      db.query(updateSql, [hashedPassword, username], (err, result) => {
        if (err) {
          console.error(`❌ Error actualizando ${username}:`, err.message);
        } else {
          console.log(`✅ ${username}: ${password} -> [hasheada]`);
        }
      });
    }

    console.log('\n🎉 Proceso completado!');
    console.log('\n📋 Credenciales para login:');
    console.log('Admin: admin / admin123');
    console.log('Supervisor: supervisor1 / supervisor123');
    console.log('Evaluador: evaluador1 / evaluador123');
    console.log('Viewer: viewer1 / viewer123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    db.end();
  }
}

// Conectar a la base de datos y ejecutar
db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Conectado a MySQL exitosamente');
    updateUserPasswords();
  }
}); 