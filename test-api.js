// Script de test de l'API de production
const testAPI = async () => {
  try {
    console.log('🧪 Test de l\'API de production...');
    
    // Test de la route racine
    const rootResponse = await fetch('https://backend-api-tasks-hwgr.vercel.app/');
    console.log('✅ Root status:', rootResponse.status);
    
    // Test de login (sans credentials pour voir si l'endpoint existe)
    const loginResponse = await fetch('https://backend-api-tasks-hwgr.vercel.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    console.log('✅ Login endpoint status:', loginResponse.status);
    
    if (loginResponse.status !== 500) {
      const loginData = await loginResponse.text();
      console.log('📝 Login response:', loginData.substring(0, 200));
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

testAPI();
