const { obtenerTurnoActual, turnoATexto, generarTurnoId } = require('./utils/turnoUtils');
const db = require('./db');

async function testTurnosValidacion() {
  console.log('🧪 Probando validaciones de turnos con turnos duplicados...\n');
  
  try {
    // Verificar turnos en la base de datos
    const turnos = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM turnos ORDER BY turno, hra_ini', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('📋 Turnos en la base de datos:');
    turnos.forEach(turno => {
      const turnoId = generarTurnoId(turno.turno, turno.hra_ini);
      const turnoTexto = turnoATexto(turno.turno, turno.hra_ini);
      console.log(`  - Turno ${turno.turno} (${turno.hra_ini}-${turno.hra_fin}) -> ID: ${turnoId}, Texto: ${turnoTexto}`);
    });
    
    // Probar diferentes horas para verificar la determinación del turno
    console.log('\n🕐 Probando determinación de turno actual:');
    const turnoActual = await obtenerTurnoActual();
    console.log(`  Turno actual: ${turnoActual} (${turnoATexto(turnoActual)})`);
    
    // Simular diferentes horas para probar la lógica
    console.log('\n⏰ Simulando diferentes horas:');
    const horasPrueba = [
      '06:00:00', // Turno 1
      '12:00:00', // Turno 1
      '14:00:00', // Turno 2
      '20:00:00', // Turno 2
      '02:00:00', // Turno 3 - Madrugada
      '23:00:00', // Turno 3 - Noche
    ];
    
    for (const hora of horasPrueba) {
      const horaDate = new Date(`2024-01-01 ${hora}`);
      const horaString = horaDate.toTimeString().slice(0, 8);
      
      // Simular la consulta SQL directamente
      const sql = `
        SELECT turno, hra_ini, hra_fin
        FROM turnos 
        WHERE TIME(?) BETWEEN hra_ini AND hra_fin 
        LIMIT 1
      `;
      
      const resultado = await new Promise((resolve, reject) => {
        db.query(sql, [horaString], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results.length > 0 ? results[0] : null);
          }
        });
      });
      
      if (resultado) {
        const turnoId = generarTurnoId(resultado.turno, resultado.hra_ini);
        const turnoTexto = turnoATexto(resultado.turno, resultado.hra_ini);
        console.log(`  ${hora} -> Turno ${resultado.turno} (${resultado.hra_ini}-${resultado.hra_fin}) -> ID: ${turnoId}, Texto: ${turnoTexto}`);
      } else {
        console.log(`  ${hora} -> No se encontró turno`);
      }
    }
    
    console.log('\n✅ Pruebas de validación completadas');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

testTurnosValidacion(); 