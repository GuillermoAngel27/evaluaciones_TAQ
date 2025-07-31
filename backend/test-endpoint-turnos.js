const axios = require('axios');

async function testTurnosEndpoint() {
  try {
    console.log('🧪 Probando endpoint de turnos...\n');
    
    // Simular un token de autenticación (esto debería ser un token válido en producción)
    const token = 'test-token';
    
    const response = await axios.get('http://localhost:4000/api/evaluaciones/turnos', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Respuesta del endpoint:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  } finally {
    process.exit(0);
  }
}

testTurnosEndpoint(); 