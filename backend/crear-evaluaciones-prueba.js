const db = require('./db');

async function crearEvaluacionesPrueba() {
  console.log('🧪 Creando evaluaciones de prueba con diferentes turnos...\n');
  
  try {
    // Obtener el primer local disponible
    const local = await new Promise((resolve, reject) => {
      db.query('SELECT id FROM locales LIMIT 1', (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
    
    if (!local) {
      console.log('❌ No hay locales disponibles');
      return;
    }
    
    console.log(`📍 Usando local ID: ${local.id}`);
    
    // Crear evaluaciones con diferentes turnos
    const evaluaciones = [
      { puntuacion: 4, comentario: 'Prueba Turno 1', turno: 1 },
      { puntuacion: 3, comentario: 'Prueba Turno 2', turno: 2 },
      { puntuacion: 5, comentario: 'Prueba Turno 3', turno: 3 },
      { puntuacion: 2, comentario: 'Prueba Turno 4', turno: 4 },
      { puntuacion: 4, comentario: 'Otra prueba Turno 1', turno: 1 },
      { puntuacion: 3, comentario: 'Otra prueba Turno 2', turno: 2 }
    ];
    
    for (const eval of evaluaciones) {
      await new Promise((resolve, reject) => {
        const sql = 'INSERT INTO evaluaciones (local_id, puntuacion, comentario, fecha, turno) VALUES (?, ?, ?, NOW(), ?)';
        db.query(sql, [local.id, eval.puntuacion, eval.comentario, eval.turno], (err, result) => {
          if (err) {
            console.error(`❌ Error creando evaluación turno ${eval.turno}:`, err);
            reject(err);
          } else {
            console.log(`✅ Evaluación creada - Turno ${eval.turno}, ID: ${result.insertId}`);
            resolve();
          }
        });
      });
    }
    
    console.log('\n📊 Verificando evaluaciones creadas:');
    const evaluacionesCreadas = await new Promise((resolve, reject) => {
      db.query('SELECT id, puntuacion, turno, comentario FROM evaluaciones WHERE local_id = ? ORDER BY fecha DESC LIMIT 10', 
        [local.id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    evaluacionesCreadas.forEach(eval => {
      console.log(`  - ID: ${eval.id}, Turno: ${eval.turno}, Puntuación: ${eval.puntuacion}, Comentario: ${eval.comentario}`);
    });
    
    console.log('\n✅ Evaluaciones de prueba creadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

crearEvaluacionesPrueba(); 