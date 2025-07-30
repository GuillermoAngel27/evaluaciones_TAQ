const axios = require('axios');

// Configuración
const BASE_URL = 'http://localhost:4000/api';
const TEST_TOKEN = 'test-token-123'; // Token de prueba

// Función para hacer peticiones con autenticación
const makeAuthenticatedRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error.response?.data || error.message);
    return null;
  }
};

// Función para hacer peticiones sin autenticación
const makePublicRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error.response?.data || error.message);
    return null;
  }
};

// Pruebas
const runTests = async () => {
  console.log('🧪 Iniciando pruebas de las rutas de evaluaciones...\n');

  // 1. Probar la ruta de estadísticas de locales
  console.log('1. Probando GET /locales/evaluaciones/estadisticas...');
  const estadisticas = await makeAuthenticatedRequest('GET', '/locales/evaluaciones/estadisticas');
  if (estadisticas) {
    console.log('✅ Estadísticas obtenidas correctamente');
    console.log(`   - Locales encontrados: ${estadisticas.length}`);
    if (estadisticas.length > 0) {
      console.log(`   - Primer local: ${estadisticas[0].nombre}`);
      console.log(`   - Tipo: ${estadisticas[0].tipo}`);
      console.log(`   - Evaluaciones: ${estadisticas[0].totalEvaluaciones}`);
      console.log(`   - Calificación promedio: ${estadisticas[0].calificacionPromedio}`);
    }
  } else {
    console.log('❌ Error obteniendo estadísticas');
  }

  // 2. Verificar que solo se muestren locales con evaluaciones
  if (estadisticas && estadisticas.length > 0) {
    console.log('\n2. Verificando que solo se muestren locales con evaluaciones...');
    const localesSinEvaluaciones = estadisticas.filter(local => local.totalEvaluaciones === 0);
    if (localesSinEvaluaciones.length === 0) {
      console.log('✅ Todos los locales mostrados tienen evaluaciones');
    } else {
      console.log(`⚠️  Se encontraron ${localesSinEvaluaciones.length} locales sin evaluaciones`);
    }
  }

  // 3. Probar la ruta de evaluaciones general
  console.log('\n3. Probando GET /evaluaciones...');
  const evaluaciones = await makeAuthenticatedRequest('GET', '/evaluaciones');
  if (evaluaciones) {
    console.log('✅ Evaluaciones obtenidas correctamente');
    console.log(`   - Evaluaciones encontradas: ${evaluaciones.length}`);
  } else {
    console.log('❌ Error obteniendo evaluaciones');
  }

  // 4. Probar la ruta de locales general
  console.log('\n4. Probando GET /locales...');
  const locales = await makeAuthenticatedRequest('GET', '/locales');
  if (locales) {
    console.log('✅ Locales obtenidos correctamente');
    console.log(`   - Locales encontrados: ${locales.length}`);
  } else {
    console.log('❌ Error obteniendo locales');
  }

  // 5. Probar health check
  console.log('\n5. Probando GET /health...');
  const health = await makePublicRequest('GET', '/health');
  if (health) {
    console.log('✅ Health check exitoso');
    console.log(`   - Status: ${health.status}`);
    console.log(`   - Mensaje: ${health.message}`);
  } else {
    console.log('❌ Error en health check');
  }

  console.log('\n🏁 Pruebas completadas');
};

// Ejecutar pruebas
runTests().catch(console.error); 