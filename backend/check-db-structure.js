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

// Función para verificar estructura de tablas
function checkTableStructure() {
  console.log('🔍 Verificando estructura de la base de datos...\n');
  
  // Verificar tabla locales
  console.log('📋 Estructura de tabla locales:');
  db.query('DESCRIBE locales', (err, results) => {
    if (err) {
      console.error('❌ Error:', err.message);
    } else {
      console.table(results);
    }
    
    // Verificar tabla evaluaciones
    console.log('\n📋 Estructura de tabla evaluaciones:');
    db.query('DESCRIBE evaluaciones', (err, results) => {
      if (err) {
        console.error('❌ Error:', err.message);
      } else {
        console.table(results);
      }
      
      // Verificar si existe la columna fecha
      console.log('\n🔍 Verificando si existe columna fecha en evaluaciones:');
      db.query("SHOW COLUMNS FROM evaluaciones LIKE 'fecha'", (err, results) => {
        if (err) {
          console.error('❌ Error:', err.message);
        } else {
          if (results.length > 0) {
            console.log('✅ Columna fecha existe');
          } else {
            console.log('❌ Columna fecha NO existe - agregando...');
            db.query('ALTER TABLE evaluaciones ADD COLUMN fecha DATETIME DEFAULT CURRENT_TIMESTAMP', (err) => {
              if (err) {
                console.error('❌ Error agregando columna fecha:', err.message);
              } else {
                console.log('✅ Columna fecha agregada exitosamente');
              }
            });
          }
        }
        
        // Verificar algunos datos de ejemplo
        console.log('\n📊 Datos de ejemplo en locales:');
        db.query('SELECT id, nombre, tipo_local, estatus FROM locales LIMIT 5', (err, results) => {
          if (err) {
            console.error('❌ Error:', err.message);
          } else {
            console.table(results);
          }
          
          console.log('\n📊 Datos de ejemplo en evaluaciones:');
          db.query('SELECT id, local_id, puntuacion, fecha FROM evaluaciones LIMIT 5', (err, results) => {
            if (err) {
              console.error('❌ Error:', err.message);
            } else {
              console.table(results);
            }
            
            db.end();
          });
        });
      });
    });
  });
}

// Conectar y ejecutar
db.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Conectado a MySQL exitosamente');
    checkTableStructure();
  }
}); 