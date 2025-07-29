const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testConnection() {
  console.log('🔍 Probando conexión con el backend...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Probando health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check exitoso:', healthResponse.data);
    
    // Test 2: Test locales endpoint
    console.log('\n2. Probando endpoint de prueba de locales...');
    const testResponse = await axios.get(`${BASE_URL}/test-locales`);
    console.log('✅ Test locales exitoso:', testResponse.data);
    
    // Test 3: GET locales
    console.log('\n3. Probando GET /api/locales...');
    const localesResponse = await axios.get(`${BASE_URL}/api/locales`);
    console.log('✅ GET locales exitoso. Total locales:', localesResponse.data.length);
    
    // Test 4: POST local (crear)
    console.log('\n4. Probando POST /api/locales...');
    const newLocal = {
      nombre: 'Test Local',
      estatus: 'Activo',
      tipo_local: 'Alimentos'
    };
    const createResponse = await axios.post(`${BASE_URL}/api/locales`, newLocal);
    console.log('✅ POST local exitoso. Local creado:', createResponse.data);
    
    const createdId = createResponse.data.id;
    
    // Test 5: PUT local (actualizar)
    console.log('\n5. Probando PUT /api/locales/' + createdId + '...');
    const updateData = {
      nombre: 'Test Local Actualizado',
      estatus: 'Inactivo',
      tipo_local: 'Misceláneas'
    };
    const updateResponse = await axios.put(`${BASE_URL}/api/locales/${createdId}`, updateData);
    console.log('✅ PUT local exitoso. Local actualizado:', updateResponse.data);
    
    // Test 6: DELETE local
    console.log('\n6. Probando DELETE /api/locales/' + createdId + '...');
    const deleteResponse = await axios.delete(`${BASE_URL}/api/locales/${createdId}`);
    console.log('✅ DELETE local exitoso:', deleteResponse.data);
    
    console.log('\n🎉 Todas las pruebas pasaron exitosamente!');
    
  } catch (error) {
    console.error('\n❌ Error en las pruebas:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data);
    console.error('URL:', error.config?.url);
    console.error('Method:', error.config?.method);
    console.error('Data:', error.config?.data);
  }
}

testConnection(); 