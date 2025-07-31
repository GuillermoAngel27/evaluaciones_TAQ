const mysql = require('mysql2');

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'evaluaciones_taq'
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  
  console.log('Conectado a la base de datos');
  
  // Consultar todos los tipos de local únicos
  const sql = 'SELECT DISTINCT tipo_local FROM locales ORDER BY tipo_local';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error consultando tipos de local:', err);
      return;
    }
    
    console.log('Tipos de local únicos en la base de datos:');
    results.forEach((row, index) => {
      console.log(`${index + 1}. "${row.tipo_local}" (longitud: ${row.tipo_local ? row.tipo_local.length : 0})`);
    });
    
    // Consultar algunos ejemplos de locales
    const sqlEjemplos = 'SELECT id, nombre, tipo_local FROM locales LIMIT 10';
    
    db.query(sqlEjemplos, (err, ejemplos) => {
      if (err) {
        console.error('Error consultando ejemplos:', err);
        return;
      }
      
      console.log('\nEjemplos de locales:');
      ejemplos.forEach(local => {
        console.log(`ID: ${local.id}, Nombre: "${local.nombre}", Tipo: "${local.tipo_local}"`);
      });
      
      db.end();
    });
  });
}); 