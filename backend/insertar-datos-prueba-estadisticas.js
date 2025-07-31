const mysql = require('mysql2/promise');
require('dotenv').config();
const { PREGUNTAS_POR_TIPO, textoPreguntaANumero } = require('./config/preguntas.js');

async function insertarDatosPrueba() {
  console.log('🚀 Insertando datos de prueba para estadísticas...\n');

  let connection;
  
  try {
    // Conectar a la base de datos
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'evaluaciones_taq',
      port: process.env.DB_PORT || 3306
    };
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión a la base de datos establecida');

    // 1. Insertar locales de prueba
    console.log('\n1. Insertando locales de prueba...');
    
    const locales = [
      { nombre: 'Restaurante El Buen Sabor', tipo: 'alimentos', estatus: 'activo' },
      { nombre: 'Café Central', tipo: 'alimentos', estatus: 'activo' },
      { nombre: 'Miscelánea La Esquina', tipo: 'miscelaneas', estatus: 'activo' },
      { nombre: 'Taxi Express', tipo: 'taxis', estatus: 'activo' },
      { nombre: 'Estacionamiento Centro', tipo: 'estacionamiento', estatus: 'activo' },
      { nombre: 'Pizzería Italia', tipo: 'alimentos', estatus: 'activo' },
      { nombre: 'Miscelánea 24/7', tipo: 'miscelaneas', estatus: 'activo' },
      { nombre: 'Taxi Seguro', tipo: 'taxis', estatus: 'activo' }
    ];

    for (const local of locales) {
      const [result] = await connection.execute(
        'INSERT INTO locales (nombre, tipo_local, estatus) VALUES (?, ?, ?)',
        [local.nombre, local.tipo, local.estatus]
      );
      console.log(`  ✅ Local insertado: ${local.nombre} (ID: ${result.insertId})`);
    }

    // 2. Obtener IDs de locales para crear evaluaciones
    const [localesResult] = await connection.execute('SELECT id, nombre, tipo_local FROM locales WHERE estatus = "activo"');
    console.log(`\n2. Locales disponibles: ${localesResult.length}`);

    // 3. Insertar evaluaciones de prueba
    console.log('\n3. Insertando evaluaciones de prueba...');
    
    const evaluaciones = [];

    // Generar evaluaciones para cada local
    for (const local of localesResult) {
      const numEvaluaciones = Math.floor(Math.random() * 10) + 5; // 5-15 evaluaciones por local
      
      for (let i = 0; i < numEvaluaciones; i++) {
        const puntuacion = Math.floor(Math.random() * 5) + 1; // 1-5
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 30)); // Últimos 30 días
        const turno = Math.floor(Math.random() * 3) + 1; // 1-3
        const comentario = puntuacion <= 2 ? 'Servicio deficiente' : 
                          puntuacion <= 3 ? 'Servicio regular' : 
                          puntuacion <= 4 ? 'Buen servicio' : 'Excelente servicio';

        const [evalResult] = await connection.execute(
          'INSERT INTO evaluaciones (local_id, puntuacion, comentario, fecha, turno) VALUES (?, ?, ?, ?, ?)',
          [local.id, puntuacion, comentario, fecha, turno]
        );

        const evaluacionId = evalResult.insertId;
        evaluaciones.push({ id: evaluacionId, local_id: local.id });

        // 4. Insertar respuestas para cada evaluación
        console.log(`  ✅ Evaluación insertada para ${local.nombre} (ID: ${evaluacionId})`);
        
        // Obtener preguntas según el tipo de local usando la configuración centralizada
        const preguntasParaLocal = PREGUNTAS_POR_TIPO[local.tipo_local] || [];
        
        if (preguntasParaLocal.length === 0) {
          console.log(`  ⚠️ No se encontraron preguntas para el tipo: ${local.tipo_local}`);
          continue;
        }

        // Insertar respuestas para cada pregunta
        for (const pregunta of preguntasParaLocal) {
          const numeroPregunta = textoPreguntaANumero(pregunta, local.tipo_local);
          const puntuacionPregunta = Math.floor(Math.random() * 5) + 1;
          
          if (numeroPregunta) {
            await connection.execute(
              'INSERT INTO respuestas (evaluacion_id, pregunta, puntuacion) VALUES (?, ?, ?)',
              [evaluacionId, numeroPregunta, puntuacionPregunta] // ✅ Insertar número en lugar de texto
            );
          } else {
            console.log(`  ⚠️ No se pudo convertir pregunta a número: ${pregunta}`);
          }
        }
      }
    }

    // 5. Mostrar resumen
    console.log('\n📊 RESUMEN DE DATOS INSERTADOS:');
    
    const [totalLocales] = await connection.execute('SELECT COUNT(*) as total FROM locales WHERE estatus = "activo"');
    const [totalEvaluaciones] = await connection.execute('SELECT COUNT(*) as total FROM evaluaciones');
    const [totalRespuestas] = await connection.execute('SELECT COUNT(*) as total FROM respuestas');
    
    console.log(`- Locales activos: ${totalLocales[0].total}`);
    console.log(`- Evaluaciones totales: ${totalEvaluaciones[0].total}`);
    console.log(`- Respuestas totales: ${totalRespuestas[0].total}`);

    // Mostrar distribución por tipo
    const [distribucionTipos] = await connection.execute(`
      SELECT tipo_local, COUNT(*) as cantidad 
      FROM locales 
      WHERE estatus = 'activo' 
      GROUP BY tipo_local
    `);
    
    console.log('- Distribución por tipo:');
    distribucionTipos.forEach(tipo => {
      console.log(`  * ${tipo.tipo_local}: ${tipo.cantidad} locales`);
    });

    console.log('\n✅ Datos de prueba insertados exitosamente!');
    console.log('🎯 Ahora puedes probar las estadísticas en el frontend.');

  } catch (error) {
    console.error('❌ Error insertando datos de prueba:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión a la base de datos cerrada');
    }
  }
}

// Ejecutar el script
insertarDatosPrueba(); 