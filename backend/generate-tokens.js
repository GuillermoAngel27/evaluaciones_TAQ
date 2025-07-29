const db = require('./db');

// Función para generar token público único
function generarTokenPublico() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 16; i++) {
    token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return token;
}

// Función para generar tokens para locales existentes
async function generarTokensParaLocales() {
  console.log('🔍 Buscando locales sin token público...');
  
  // Buscar locales sin token público
  const checkSql = 'SELECT id, nombre FROM locales WHERE token_publico IS NULL OR token_publico = ""';
  
  db.query(checkSql, (err, results) => {
    if (err) {
      console.error('❌ Error buscando locales sin token:', err);
      process.exit(1);
    }
    
    if (results.length === 0) {
      console.log('✅ Todos los locales ya tienen tokens públicos');
      process.exit(0);
    }
    
    console.log(`📝 Generando tokens para ${results.length} locales...`);
    
    // Generar tokens para cada local
    let completed = 0;
    const total = results.length;
    
    results.forEach(local => {
      const tokenPublico = generarTokenPublico();
      const updateSql = 'UPDATE locales SET token_publico = ? WHERE id = ?';
      
      db.query(updateSql, [tokenPublico, local.id], (err) => {
        if (err) {
          console.error(`❌ Error actualizando token para local ${local.id} (${local.nombre}):`, err);
        } else {
          console.log(`✅ Token generado para: ${local.nombre} (ID: ${local.id}) -> ${tokenPublico}`);
        }
        
        completed++;
        if (completed === total) {
          console.log(`\n🎉 ¡Completado! Se generaron tokens para ${total} locales`);
          process.exit(0);
        }
      });
    });
  });
}

// Ejecutar el script
console.log('🚀 Iniciando generación de tokens públicos...\n');
generarTokensParaLocales(); 