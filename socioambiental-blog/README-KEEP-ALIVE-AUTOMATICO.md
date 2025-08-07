# Keep Alive Automático 100%

Sistema que mantém seu site ativo 24/7 sem depender de usuários.

## 🚀 Instalação Rápida

```bash
# 1. Executar script de configuração
node setup-automatic-keep-alive.js

# 2. Instalar PM2 globalmente (recomendado)
npm install -g pm2

# 3. Iniciar serviço
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 📋 Modos de Execução

### 1. Modo Manual
```bash
node keep-alive-automatico.js
```

### 2. Modo Teste
```bash
node keep-alive-automatico.js --test
```

### 3. Modo PM2 (Recomendado)
```bash
# Iniciar
pm2 start ecosystem.config.js

# Ver logs
pm2 logs keep-alive-automatico

# Status
pm2 status

# Parar
pm2 stop keep-alive-automatico
```

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz:

```env
BACKEND_URL=https://blogsocioambiental-afs-1.onrender.com
FRONTEND_URL=https://blogsocioambiental-afs-1itd.vercel.app
KEEP_ALIVE_INTERVAL=45
KEEP_ALIVE_TIMEOUT=15000
```

## 📊 Monitoramento

### Logs
- **Arquivo**: `keep-alive-status.log`
- **PM2**: `pm2 logs keep-alive-automatico`
- **Tempo real**: `tail -f keep-alive-status.log`

### URLs Monitoradas
- Backend: `/health`, `/api/health`, `/ping`
- Frontend: URL principal
- Intervalo: 45 segundos

## 🔄 Reinicialização Automática

Com PM2, o serviço reinicia automaticamente:
- Em caso de falha
- Após reinicialização do servidor
- Mantém logs persistentes

## 📱 Comandos Úteis

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs keep-alive-automatico

# Parar serviço
pm2 stop keep-alive-automatico
```

## 📞 Suporte

Para dúvidas ou melhorias, abra uma issue no repositório.

---
