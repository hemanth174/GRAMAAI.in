// Quick status check for the appointment system
const axios = require('axios');

async function checkStatus() {
  console.log('🔍 Checking Hospital Management System Status...\n');
  
  try {
    // Test Hospital backend
    console.log('📊 Testing Hospital Backend (port 5000)...');
    const response = await axios.get('http://localhost:5000/api/appointments');
    console.log('✅ Hospital backend: Connected');
    console.log(`   Found ${response.data?.data?.length || 0} appointments`);
  } catch (error) {
    console.log('❌ Hospital backend: Not running or error occurred');
    console.log(`   Error: ${error.message}`);
  }
  
  try {
    // Test streaming endpoint
    console.log('\n📡 Testing Streaming Endpoint...');
    const streamResponse = await axios.get('http://localhost:5000/api/appointments/stream', {
      timeout: 2000,
      responseType: 'text'
    });
    console.log('✅ Streaming endpoint: Available');
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.log('✅ Streaming endpoint: Available (timeout expected for SSE)');
    } else {
      console.log('❌ Streaming endpoint: Error occurred');
      console.log(`   Error: ${error.message}`);
    }
  }
  
  console.log('\n🏁 Status check complete!');
}

checkStatus().catch(console.error);