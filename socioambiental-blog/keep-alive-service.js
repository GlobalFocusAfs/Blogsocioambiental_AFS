/**
 * Serviço de Keep-Alive para manter o site ativo no Render
 * Execute este script periodicamente (ex: a cada 5-10 minutos)
 * 
 * Para usar:
 * 1. Instale as dependências: npm install axios
 * 2. Configure a URL do seu backend no Render
 * 3. Execute: node keep-alive-service.js
 */

const axios = require('axios');

// Configurações
const CONFIG = {
    // Substitua pela URL do seu backend no Render
    backendUrl: process.env.RENDER_URL || 'https://seu-backend-no-render.com',
    
    // Intervalo entre requisições (em milissegundos)
    // Recomendado: 5-10 minutos (300000-600000ms)
    interval: 5 * 60 * 1000, // 5 minutos
    
    // Timeout para requisições
    timeout: 10000,
    
    // Número máximo de tentativas em caso de erro
    maxRetries: 3
};

// Função para fazer requisição de keep-alive
async function keepAlive() {
    const timestamp = new Date().toISOString();
    
    try {
        console.log(`[${timestamp}] Enviando ping de keep-alive...`);
        
        // Fazer requisição ao endpoint de health check
        const response = await axios.get(`${CONFIG.backendUrl}/health`, {
            timeout: CONFIG.timeout
        });
        
        console.log(`✅ [${timestamp}] Keep-alive bem-sucedido! Status: ${response.data.status}`);
        
    } catch (error) {
        console.error(`❌ [${timestamp}] Erro no keep-alive:`, error.message);
        
        // Tentar novamente com o endpoint /ping se /health falhar
        try {
            const pingResponse = await axios.get(`${CONFIG.backendUrl}/ping`, {
                timeout: CONFIG.timeout
            });
            console.log(`✅ [${timestamp}] Ping alternativo bem-sucedido!`);
        } catch (pingError) {
            console.error(`❌ [${timestamp}] Ping alternativo também falhou:`, pingError.message);
        }
    }
}

// Função para iniciar o serviço
function startKeepAlive() {
    console.log('🚀 Iniciando serviço de keep-alive...');
    console.log(`Backend URL: ${CONFIG.backendUrl}`);
    console.log(`Intervalo: ${CONFIG.interval / 1000 / 60} minutos`);
    
    // Executar imediatamente
    keepAlive();
    
    // Agendar execuções periódicas
    setInterval(keepAlive, CONFIG.interval);
}

// Função para testar a conexão uma única vez
async function testConnection() {
    console.log('🔍 Testando conexão com o backend...');
    
    const endpoints = ['/health', '/ping', '/wake-up'];
    
    for (const endpoint of endpoints) {
        try {
            const response = await axios.get(`${CONFIG.backendUrl}${endpoint}`, {
                timeout: CONFIG.timeout
            });
            console.log(`✅ ${endpoint}:`, response.data);
        } catch (error) {
            console.error(`❌ ${endpoint}:`, error.message);
        }
    }
}

// Executar se for chamado diretamente
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--test')) {
        testConnection();
    } else {
        startKeepAlive();
    }
}

module.exports = {
    keepAlive,
    startKeepAlive,
    testConnection,
    CONFIG
};
