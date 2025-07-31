const db = require('./db');

async function testEvaluacionesTurno() {
  console.log('🔍 Verificando evaluaciones con campo turno...\n');
  
  try {
    // Verificar evaluaciones existentes
    const evaluaciones = await new Promise((resolve, reject) => {
      db.query('SELECT id, puntuacion, fecha, turno FROM evaluaciones ORDER BY fecha DESC LIMIT 10', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('📋 Últimas 10 evaluaciones:');
    evaluaciones.forEach(eval => {
      console.log(`  - ID: ${eval.id}, Puntuación: ${eval.puntuacion}, Fecha: ${eval.fecha}, Turno: ${eval.turno || 'NULL'}`);
    });
    
    // Contar evaluaciones sin turno
    const evaluacionesSinTurno = await new Promise((resolve, reject) => {
      db.query('SELECT COUNT(*) as count FROM evaluaciones WHERE turno IS NULL OR turno = 0', (err, results) => {
        if (err) reject(err);
        else resolve(results[0].count);
      });
    });
    
    console.log(`\n📊 Evaluaciones sin turno: ${evaluacionesSinTurno}`);
    
    if (evaluacionesSinTurno > 0) {
      console.log('🔄 Actualizando evaluaciones sin turno...');
      
      // Actualizar evaluaciones sin turno a turno 1 por defecto
      await new Promise((resolve, reject) => {
        db.query('UPDATE evaluaciones SET turno = 1 WHERE turno IS NULL OR turno = 0', (err, result) => {
          if (err) reject(err);
          else {
            console.log(`✅ ${result.affectedRows} evaluaciones actualizadas`);
            resolve();
          }
        });
      });
    }
    
    // Verificar distribución de turnos
    const distribucionTurnos = await new Promise((resolve, reject) => {
      db.query('SELECT turno, COUNT(*) as count FROM evaluaciones GROUP BY turno ORDER BY turno', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('\n📈 Distribución de turnos:');
    distribucionTurnos.forEach(item => {
      console.log(`  - Turno ${item.turno}: ${item.count} evaluaciones`);
    });
    
    console.log('\n✅ Verificación completada');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

testEvaluacionesTurno(); 