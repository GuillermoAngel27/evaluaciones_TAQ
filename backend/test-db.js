const db = require('./db');

async function testDB() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Probar consulta simple
    const [results] = await db.query('SELECT 1 as test');
    console.log('✅ Consulta exitosa:', results);
    
    // Probar consulta a locales
    const [locales] = await db.query('SELECT COUNT(*) as total FROM locales WHERE estatus = "activo"');
    console.log('✅ Locales activos:', locales[0].total);
    
  } catch (error) {
    console.error('❌ Error en la consulta:', error);
  } finally {
    await db.end();
  }
}

testDB(); 