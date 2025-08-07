/**
 * Serviço Externo de Keep-Alive para Render
 * Usa cron-job.org ou similar para garantir 100% uptime
 * 
 * Para configurar:
 * 1. Acesse https://cron-job.org
 * 2. Crie um job para: https://blogsocioambiental-afs-1.onrender.com/wake-up
 * 3. Configure para rodar a cada 5 minutos
 * 4. Use este script como backup
 */

const https = require('https');

const BACKEND_URL = 'https://blogsocioambiental-afs-1.onrender.com';
const ENDPOINTS = ['/health', '/wake-up', '/ping'];

// Função para manter o backend ativo
async function keepBackendAlive() {
    for (const endpoint of ENDPOINTS) {
        try {
            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
                method: 'GET',
                mode: 'cors'
            });
            
            if (response.ok) {
                console.log(`✅ ${endpoint}: Backend ativo`);
                break; // Se um funcionar, já mantém ativo
            }
        } catch (error) {
            console.error(`❌ Erro em ${endpoint}:`, error.message);
        }
    }
}

// Executar imediatamente e depois a cada 4 minutos
keepBackendAlive();
setInterval(keepBackendAlive, 4 * 60 * 1000); // 4 minutos
