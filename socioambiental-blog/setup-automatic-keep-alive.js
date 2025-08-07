#!/usr/bin/env node

/**
 * Script de instalação e configuração do Keep Alive Automático
 * Torna o sistema 100% automático
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando Keep Alive Automático...\n');

// 1. Instalar dependências
console.log('📦 Instalando dependências...');
try {
    execSync('npm install axios', { stdio: 'inherit' });
    console.log('✅ Dependências instaladas');
} catch (error) {
    console.log('⚠️  Axios já instalado ou erro na instalação');
}

// 2. Criar arquivo de configuração
const configContent = `# Configuração do Keep Alive Automático
# Copie este arquivo para .env e ajuste conforme necessário

# URLs do seu projeto
BACKEND_URL=https://blogsocioambiental-afs-1.onrender.com
FRONTEND_URL=https://blogsocioambiental-afs-1itd.vercel.app

# Intervalo em segundos (mínimo 30 segundos para não sobrecarregar)
KEEP_ALIVE_INTERVAL=45

# Timeout para requisições (ms)
KEEP_ALIVE_TIMEOUT=15000
`;

fs.writeFileSync('.env.example', configContent);
console.log('✅ Arquivo .env.example criado');

// 3. Criar script de inicialização
const startScript = `#!/bin/bash
# Script para iniciar o Keep Alive Automático

echo "🚀 Iniciando Keep Alive Automático..."
node keep-alive-automatico.js
`;

fs.writeFileSync('start-keep-alive.sh', startScript);
fs.chmodSync('start-keep-alive.sh', '755');
console.log('✅ Script start-keep-alive.sh criado');

// 4. Criar serviço PM2
const pm2Config = {
    apps: [{
        name: 'keep-alive-automatico',
        script: 'keep-alive-automatico.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '100M',
        env: {
            NODE_ENV: 'production'
        }
    }]
};

fs.writeFileSync('ecosystem.config.js', JSON.stringify(pm2Config, null, 2));
console.log('✅ Configuração PM2 criada');

// 5. Criar instruções
const instructions = `
=== Keep Alive Automático Configurado! ===

📋 Próximos passos:

1. **Executar manualmente:**
   node keep-alive-automatico.js

2. **Executar em background com PM2:**
   npm install -g pm2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup

3. **Testar conexão:**
   node keep-alive-automatico.js --test

4. **Ver logs:**
   pm2 logs keep-alive-automatico
   ou
   tail -f keep-alive-status.log

5. **Parar serviço:**
   pm2 stop keep-alive-automatico

=== URLs Monitoradas ===
- Backend: https://blogsocioambiental-afs-1.onrender.com
- Frontend: https://blogsocioambiental-afs-1itd.vercel.app
- Intervalo: 45 segundos

=== Monitoramento ===
- Logs salvos em: keep-alive-status.log
- Status em tempo real via PM2
`;

console.log(instructions);

// 6. Criar package.json atualizado se não existir
if (!fs.existsSync('package.json')) {
    const packageJson = {
        "name": "keep-alive-automatico",
        "version": "2.0.0",
        "description": "Sistema automático de keep alive para manter o site ativo 24/7",
        "main": "keep-alive-automatico.js",
        "scripts": {
            "start": "node keep-alive-automatico.js",
            "test": "node keep-alive-automatico.js --test",
            "pm2:start": "pm2 start ecosystem.config.js",
            "pm2:stop": "pm2 stop keep-alive-automatico",
            "pm2:logs": "pm2 logs keep-alive-automatico"
        },
        "dependencies": {
            "axios": "^1.6.0"
        },
        "devDependencies": {
            "pm2": "^5.3.0"
        }
    };
    
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json criado');
}

console.log('\n🎉 Configuração concluída! Use: npm start');
