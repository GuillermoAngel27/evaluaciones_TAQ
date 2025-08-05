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
    console.log('🔍 Verificando si el usuario admin existe...');
    
    // Verificar si el usuario admin ya existe
    const checkSql = 'SELECT id, username, rol FROM usuarios WHERE username = ?';
    db.query(checkSql, ['admin'], (err, results) => {
      if (err) {
        console.error('❌ Error verificando usuario admin:', err.message);
        return;
      }

      if (results.length > 0) {
        console.log('✅ Usuario admin ya existe:');
        console.log(`   ID: ${results[0].id}`);
        console.log(`   Username: ${results[0].username}`);
        console.log(`   Rol: ${results[0].rol}`);
        return;
      }

      console.log('📝 Usuario admin no existe, creando...');
      
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
        if (insertErr) {
          console.error('❌ Error creando usuario admin:', insertErr.message);
        } else {
          console.log('✅ Usuario admin creado exitosamente');
          console.log('   Username: admin');
          console.log('   Password: admin2025');
          console.log('   Rol: administrador');
          console.log('   ID: ' + insertResults.insertId);
        }
      });
    });
  } catch (error) {
    console.error('❌ Error en createAdminUser:', error.message);
  }
};

// Conectar a la base de datos y ejecutar la función
db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Conectado a MySQL exitosamente');
    createAdminUser();
    
    // Cerrar conexión después de 3 segundos
    setTimeout(() => {
      db.end();
      console.log('🔌 Conexión cerrada');
      process.exit(0);
    }, 3000);
  }
}); 