const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function testEstadisticas() {
  console.log('🔍 Probando endpoint de estadísticas...\n');

  try {
    // 1. Probar endpoint sin token
    console.log('1. Probando endpoint sin token...');
    try {
      const response = await axios.get(`${API_BASE}/estadisticas/generales`);
      console.log('❌ ERROR: Debería haber fallado sin token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correcto: Endpoint requiere autenticación');
      } else {
        console.log('❌ Error inesperado:', error.response?.status, error.response?.data);
      }
    }

    // 2. Hacer login para obtener token
    console.log('\n2. Haciendo login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso, token obtenido');

    // 3. Probar endpoint con token
    console.log('\n3. Probando endpoint con token...');
    const statsResponse = await axios.get(`${API_BASE}/estadisticas/generales`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Estadísticas obtenidas exitosamente');
    console.log('Datos recibidos:', statsResponse.data.length, 'locales');
    
    if (statsResponse.data.length > 0) {
      console.log('Primer local:', statsResponse.data[0]);
    }

    // 4. Probar endpoint de preguntas
    console.log('\n4. Probando endpoint de preguntas...');
    const preguntasResponse = await axios.get(`${API_BASE}/estadisticas/preguntas/alimentos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Preguntas obtenidas exitosamente');
    console.log('Preguntas:', preguntasResponse.data);

  } catch (error) {
    console.error('❌ Error en la prueba:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    if (error.response?.data?.details) {
      console.error('Details:', error.response.data.details);
    }
  }
}

testEstadisticas(); 