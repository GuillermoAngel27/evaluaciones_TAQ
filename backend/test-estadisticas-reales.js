const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function testEstadisticasReales() {
  console.log('🔍 Probando estadísticas con datos reales...\n');

  try {
    // 1. Hacer login para obtener token
    console.log('1. Haciendo login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso, token obtenido');

    // 2. Probar endpoint de estadísticas generales
    console.log('\n2. Probando endpoint de estadísticas generales...');
    const statsResponse = await axios.get(`${API_BASE}/locales/evaluaciones/estadisticas`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Estadísticas generales obtenidas exitosamente');
    console.log('Datos recibidos:', statsResponse.data.length, 'locales');
    
    if (statsResponse.data.length > 0) {
      console.log('Primer local:', {
        nombre: statsResponse.data[0].nombre,
        tipo: statsResponse.data[0].tipo,
        totalEvaluaciones: statsResponse.data[0].totalEvaluaciones,
        calificacionPromedio: statsResponse.data[0].calificacionPromedio
      });
    }

    // 3. Probar endpoint de respuestas por pregunta
    console.log('\n3. Probando endpoint de respuestas por pregunta...');
    const respuestasResponse = await axios.get(`${API_BASE}/locales/respuestas-por-pregunta?pregunta=¿El personal fue amable?`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Respuestas por pregunta obtenidas exitosamente');
    console.log('Respuestas encontradas:', respuestasResponse.data.length);
    
    if (respuestasResponse.data.length > 0) {
      console.log('Primera respuesta:', {
        local: respuestasResponse.data[0].nombre_local,
        puntuacion: respuestasResponse.data[0].puntuacion,
        fecha: respuestasResponse.data[0].fecha
      });
    }

    // 4. Probar filtro por tipo de local
    console.log('\n4. Probando filtro por tipo de local...');
    const respuestasFiltradasResponse = await axios.get(`${API_BASE}/locales/respuestas-por-pregunta?pregunta=¿El personal fue amable?&tipo_local=alimentos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Respuestas filtradas por tipo obtenidas exitosamente');
    console.log('Respuestas filtradas encontradas:', respuestasFiltradasResponse.data.length);

    // 5. Mostrar resumen de datos
    console.log('\n📊 RESUMEN DE DATOS:');
    console.log(`- Total de locales con evaluaciones: ${statsResponse.data.length}`);
    
    if (statsResponse.data.length > 0) {
      const tipos = {};
      const promedios = [];
      
      statsResponse.data.forEach(local => {
        // Contar por tipo
        const tipo = local.tipo || 'sin_tipo';
        tipos[tipo] = (tipos[tipo] || 0) + 1;
        
        // Acumular promedios
        if (local.calificacionPromedio > 0) {
          promedios.push(local.calificacionPromedio);
        }
      });
      
      console.log('- Distribución por tipo:');
      Object.entries(tipos).forEach(([tipo, cantidad]) => {
        console.log(`  * ${tipo}: ${cantidad} locales`);
      });
      
      if (promedios.length > 0) {
        const promedioGeneral = promedios.reduce((a, b) => a + b, 0) / promedios.length;
        console.log(`- Calificación promedio general: ${promedioGeneral.toFixed(2)}`);
      }
    }
    
    console.log(`- Total de respuestas para "¿El personal fue amable?": ${respuestasResponse.data.length}`);

  } catch (error) {
    console.error('❌ Error en la prueba:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testEstadisticasReales(); 