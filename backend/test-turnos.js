const { obtenerTurnoActual, obtenerTodosLosTurnos, turnoATexto } = require('./utils/turnoUtils');

async function testTurnos() {
  console.log('🧪 Probando funcionalidad de turnos...\n');
  
  try {
    // Probar obtener todos los turnos
    console.log('1. Obteniendo todos los turnos configurados:');
    const todosLosTurnos = await obtenerTodosLosTurnos();
    todosLosTurnos.forEach(turno => {
      console.log(`   - ${turnoATexto(turno.turno)}: ${turno.hra_ini} - ${turno.hra_fin}`);
    });
    
    console.log('\n2. Probando turno actual:');
    const turnoActual = await obtenerTurnoActual();
    console.log(`   Turno actual: ${turnoActual} (${turnoATexto(turnoActual)})`);
    
    // Simular diferentes horas para probar la lógica
    console.log('\n3. Simulando diferentes horas:');
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
      const db = require('./db');
      const sql = `
        SELECT turno 
        FROM turnos 
        WHERE TIME(?) BETWEEN hra_ini AND hra_fin 
        LIMIT 1
      `;
      
             const resultado = await new Promise((resolve, reject) => {
         db.query(sql, [horaString], (err, results) => {
           if (err) {
             reject(err);
           } else {
             resolve(results.length > 0 ? results[0].turno : 'No encontrado');
           }
         });
       });
       
       console.log(`   ${hora} -> ${resultado} ${resultado !== 'No encontrado' ? `(${turnoATexto(resultado)})` : ''}`);
    }
    
    console.log('\n✅ Pruebas de turnos completadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    process.exit(0);
  }
}

testTurnos(); 