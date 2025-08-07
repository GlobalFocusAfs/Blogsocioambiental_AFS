#!/usr/bin/env node

/**
 * Sistema Automático de Keep Alive 100%
 * Funciona sem usuários no site
 * Mantém backend e frontend ativos automaticamente
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configurações automáticas
const CONFIG = {
    backendUrl: process.env.BACKEND_URL || 'https://blogsocioambiental-afs-1.onrender.com',
    frontendUrl: process.env.FRONTEND_URL || 'https://blogsocioambiental-afs-1itd.vercel.app',
    interval: parseInt(process.env.KEEP_ALIVE_INTERVAL) || 45, // segundos
    timeout: 15000,
    maxRetries: 3,
    retryDelay: 2000
};

// Logger
const logFile = path.join(__dirname, 'keep-alive-status.log');
const logger = {
    log: (level, message) => {
        const timestamp = new Date().toISOString();
        const log = `[${timestamp}] ${level}: ${message}`;
        console.log(log);
        fs.appendFileSync(logFile, log + '\n');
    },
    info: (msg) => logger.log('INFO', msg),
    error: (msg) => logger.log('ERROR', msg),
    success: (msg) => logger.log('SUCCESS', msg)
};

// Função para fazer requisição
async function pingUrl(url, attempt = 1) {
    try {
        const response = await axios.get(url, {
            timeout: CONFIG.timeout,
            headers: {
                'User-Agent': 'Keep-Alive-Bot/2.0',
                'Cache-Control': 'no-cache'
            }
        });
        
        logger.success(`${url} - Status: ${response.status}`);
        return true;
    } catch (error) {
        logger.error(`${url} - Erro: ${error.message}`);
        
        if (attempt < CONFIG.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
            return pingUrl(url, attempt + 1);
        }
        return false;
    }
}

// Função principal de keep alive
async function keepAliveCycle() {
    logger.info('=== Ciclo de Keep Alive ===');
    
    const urls = [
        `${CONFIG.backendUrl}/health`,
        `${CONFIG.backendUrl}/api/health`,
        `${CONFIG.backendUrl}/ping`,
        CONFIG.backendUrl,
        CONFIG.frontendUrl
    ];
    
    const results = await Promise.allSettled(
        urls.map(url => pingUrl(url))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const failed = results.length - successful;
    
    logger.info(`✅ Sucesso: ${successful}, ❌ Falhas: ${failed}`);
}

// Iniciar serviço
function startService() {
    logger.info('🚀 Iniciando Keep Alive Automático...');
    logger.info(`Backend: ${CONFIG.backendUrl}`);
    logger.info(`Frontend: ${CONFIG.frontendUrl}`);
    logger.info(`Intervalo: ${CONFIG.interval}s`);
    
    // Executar imediatamente
    keepAliveCycle();
    
    // Agendar execuções
    setInterval(keepAliveCycle, CONFIG.interval * 1000);
    
    // Handler para encerramento
    process.on('SIGINT', () => {
        logger.info('Serviço encerrado');
        process.exit(0);
    });
}

// Executar
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--test')) {
        logger.info('🔍 Modo teste');
        keepAliveCycle();
    } else {
        startService();
    }
}

module.exports = { startService, keepAliveCycle };
