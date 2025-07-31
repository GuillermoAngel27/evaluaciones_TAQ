const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function testEndpoint() {
  console.log('🔍 Probando endpoint de respuestas por pregunta...\n');

  try {
    // 1. Hacer login para obtener token
    console.log('1. Haciendo login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso, token obtenido');

    // 2. Probar endpoint de respuestas por pregunta
    console.log('\n2. Probando endpoint de respuestas por pregunta...');
    const url = `${API_BASE}/locales/respuestas-por-pregunta?pregunta=¿El personal fue amable?`;
    console.log('URL:', url);
    
    const respuestasResponse = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Respuestas por pregunta obtenidas exitosamente');
    console.log('Respuestas encontradas:', respuestasResponse.data.length);
    
    if (respuestasResponse.data.length > 0) {
      console.log('Primera respuesta:', respuestasResponse.data[0]);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('URL:', error.config?.url);
  }
}

testEndpoint(); 