require('dotenv').config();
const mysql = require('mysql2');

console.log('🧪 Script de prueba de conexión a la base de datos');
console.log('================================================');

// Mostrar configuración
console.log('🔧 Configuración actual:');
console.log(`   DB_HOST: ${process.env.DB_HOST || 'NO CONFIGURADO'}`);
console.log(`   DB_USER: ${process.env.DB_USER || 'NO CONFIGURADO'}`);
console.log(`   DB_NAME: ${process.env.DB_NAME || 'NO CONFIGURADO'}`);
console.log(`   DB_PORT: ${process.env.DB_PORT || 3306}`);
console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? 'CONFIGURADO' : 'NO CONFIGURADO'}`);

// Crear conexión de prueba
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectTimeout: 10000,
  acquireTimeout: 10000,
  timeout: 10000
});

console.log('\n🔌 Intentando conectar a la base de datos...');

connection.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión:');
    console.error(`   Mensaje: ${err.message}`);
    console.error(`   Código: ${err.code}`);
    console.error(`   Número: ${err.errno}`);
    console.error(`   SQL State: ${err.sqlState}`);
    
    // Sugerencias según el tipo de error
    if (err.code === 'ECONNREFUSED') {
      console.error('\n💡 Sugerencia: El servidor MySQL no está disponible en el puerto especificado');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Sugerencia: Credenciales incorrectas (usuario o contraseña)');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Sugerencia: La base de datos no existe');
    } else if (err.code === 'ENOTFOUND') {
      console.error('\n💡 Sugerencia: No se puede resolver el hostname');
    }
    
    process.exit(1);
  }
  
  console.log('✅ Conexión establecida exitosamente!');
  
  // Probar una consulta simple
  console.log('\n🔍 Probando consulta simple...');
  connection.query('SELECT 1 as test, NOW() as current_time', (err, results) => {
    if (err) {
      console.error('❌ Error en consulta de prueba:', err.message);
    } else {
      console.log('✅ Consulta exitosa:');
      console.log(`   Test: ${results[0].test}`);
      console.log(`   Hora actual: ${results[0].current_time}`);
    }
    
    // Verificar si existe la tabla usuarios
    console.log('\n🔍 Verificando tabla usuarios...');
    connection.query('SHOW TABLES LIKE "usuarios"', (err, results) => {
      if (err) {
        console.error('❌ Error verificando tabla usuarios:', err.message);
      } else if (results.length > 0) {
        console.log('✅ Tabla usuarios existe');
        
        // Contar usuarios
        connection.query('SELECT COUNT(*) as count FROM usuarios', (err, results) => {
          if (err) {
            console.error('❌ Error contando usuarios:', err.message);
          } else {
            console.log(`   Total de usuarios: ${results[0].count}`);
          }
          connection.end();
        });
      } else {
        console.log('⚠️  Tabla usuarios no existe');
        connection.end();
      }
    });
  });
});

// Manejar errores de conexión
connection.on('error', (err) => {
  console.error('❌ Error en la conexión:', err.message);
  process.exit(1);
});
