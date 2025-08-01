const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

// Función para obtener token de autenticación
async function getAuthToken() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    return response.data.token;
  } catch (error) {
    console.error('Error obteniendo token:', error.response?.data || error.message);
    return null;
  }
}

// Función para probar endpoint
async function testEndpoint(endpoint, token) {
  try {
    console.log(`\n🔍 Probando: ${endpoint}`);
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`✅ ${endpoint} - Exitoso`);
    console.log('Respuesta:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.log(`❌ ${endpoint} - Error`);
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
    return false;
  }
}

// Función principal
async function testDashboardEndpoints() {
  console.log('🚀 Iniciando pruebas de endpoints del Dashboard...\n');
  
  // Obtener token
  const token = await getAuthToken();
  if (!token) {
    console.error('❌ No se pudo obtener token de autenticación');
    console.log('💡 Asegúrate de que las contraseñas estén generadas ejecutando: node generate-passwords.js');
    return;
  }
  
  console.log('✅ Token obtenido correctamente\n');
  
  // Lista de endpoints a probar
  const endpoints = [
    '/evaluaciones/dashboard/stats',
    '/evaluaciones/dashboard/top-locales?limit=5',
    '/evaluaciones/dashboard/ultimas?limit=6',
    '/evaluaciones/dashboard/comentarios?limit=6',
    '/evaluaciones/dashboard/calificaciones-por-tipo',
    '/evaluaciones/dashboard/por-dia?dias=7'
  ];
  
  let successCount = 0;
  let totalCount = endpoints.length;
  
  // Probar cada endpoint
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint, token);
    if (success) successCount++;
  }
  
  // Resumen
  console.log('\n📊 RESUMEN DE PRUEBAS');
  console.log('=====================');
  console.log(`✅ Exitosos: ${successCount}/${totalCount}`);
  console.log(`❌ Fallidos: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 ¡Todos los endpoints funcionan correctamente!');
  } else {
    console.log('\n⚠️  Algunos endpoints tienen problemas. Revisar logs del servidor.');
  }
}

// Ejecutar pruebas
testDashboardEndpoints().catch(console.error); 