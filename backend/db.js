const mysql = require('mysql2');
require('dotenv').config();

// Logging de configuración
console.log('🔧 Configurando pool de conexiones MySQL:');
console.log(`   Host: ${process.env.DB_HOST || 'NO CONFIGURADO'}`);
console.log(`   User: ${process.env.DB_USER || 'NO CONFIGURADO'}`);
console.log(`   Database: ${process.env.DB_NAME || 'NO CONFIGURADO'}`);
console.log(`   Port: ${process.env.DB_PORT || 3306}`);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000
});

// Manejar errores del pool
pool.on('connection', (connection) => {
  console.log('✅ Nueva conexión establecida con MySQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en el pool de conexiones MySQL:', err.message);
  console.error('   Código de error:', err.code);
  console.error('   Número de error:', err.errno);
});

module.exports = pool; 