# 🚀 Configuração do Keep-Alive para Render

Este guia explica como configurar o sistema de keep-alive para manter seu site sempre ativo no Render.

## 📋 O que foi implementado

### 1. **Endpoints de Health Check no Backend**
- `/health` - Verifica o status completo do serviço
- `/ping` - Verifica conexão com MongoDB
- `/wake-up` - Força ativação do serviço

### 2. **Serviço de Keep-Alive para Node.js**
- `keep-alive-service.js` - Script para executar periodicamente
- Monitoramento automático do backend

### 3. **Utilitário para Frontend**
- `keepAlive.js` - Mantém conexão ativa via browser

## 🛠️ Como usar

### Opção 1: Serviço de Keep-Alive (Recomendado)

1. **Instale as dependências:**
```bash
cd socioambiental-blog
npm install axios
```

2. **Configure a URL do backend:**
Edite o arquivo `keep-alive-service.js` e altere:
```javascript
backendUrl: 'https://seu-backend-no-render.com'
```

3. **Execute o serviço:**
```bash
node keep-alive-service.js
```

### Opção 2: Cron Job no Render

Adicione este comando ao seu projeto no Render:
```bash
curl -X GET https://seu-backend-no-render.com/wake-up
```

### Opção 3: Frontend Auto-Keep-Alive

O frontend já está configurado para manter o backend ativo automaticamente em produção.

## 📊 Endpoints disponíveis

| Endpoint | Descrição | Uso |
|----------|-----------|-----|
| `GET /health` | Status completo do serviço | Monitoramento geral |
| `GET /ping` | Verifica MongoDB | Ping simples |
| `GET /wake-up` | Ativa o serviço | Forçar ativação |

## 🔧 Configuração no Render

### 1. Configurar variáveis de ambiente
Adicione no Render:
```
RENDER_URL=https://seu-backend-no-render.com
```

### 2. Cron Job (opcional)
Crie um cron job que execute:
```bash
*/5 * * * * curl -X GET https://seu-backend-no-render.com/wake-up
```

### 3. Monitoramento
Use ferramentas como:
- **UptimeRobot** (gratuito)
- **Pingdom**
- **StatusCake**

## 🎯 Exemplos de uso

### Testar conexão:
```bash
node keep-alive-service.js --test
```

### Usar no frontend:
```javascript
import keepAlive from './utils/keepAlive';

// Iniciar automaticamente
keepAlive.start();

// Ou manualmente
keepAlive.wakeUp().then(response => {
    console.log('Serviço ativado:', response);
});
```

## 🚨 Solução de problemas

### Se as imagens continuarem sendo apagadas:
1. Verifique se o serviço de keep-alive está rodando
2. Confirme se a URL do backend está correta
3. Teste os endpoints manualmente
4. Verifique logs no Render

### Logs de erro comuns:
- **ECONNREFUSED**: Backend não está acessível
- **ENOTFOUND**: URL incorreta
- **Timeout**: Backend está lento ou offline

## 📈 Monitoramento

### Verificar status manualmente:
```bash
curl https://seu-backend-no-render.com/health
```

### Dashboard de monitoramento:
Acesse `/health` no seu backend para ver status em tempo real.
