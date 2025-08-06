/**
 * Utilitário de Keep-Alive para o frontend - Versão Corrigida
 * Resolve problemas de CORS e melhora a confiabilidade
 * 
 * URLs configuradas:
 * Frontend: https://blogsocioambiental-afs-1itd.vercel.app/
 * Backend: https://blogsocioambiental-afs-1.onrender.com
 */

// Configurações - usando as URLs corretas do seu ambiente
const KEEP_ALIVE_CONFIG = {
    // URL do backend no Render - sua URL correta
    backendUrl: 'https://blogsocioambiental-afs-1.onrender.com',
    
    // Intervalo entre requisições (em milissegundos)
    interval: 10 * 60 * 1000, // 10 minutos para não sobrecarregar o Render
    
    // Ativar/desativar o keep-alive
    enabled: true,
    
    // Timeout para requisições
    timeout: 15000,
    
    // Número de tentativas antes de desistir
    maxRetries: 3
};

class KeepAliveServiceFixed {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
        this.retryCount = 0;
    }

    /**
     * Inicia o serviço de keep-alive
     */
    start() {
        if (!KEEP_ALIVE_CONFIG.enabled || this.isRunning) {
            console.log('Keep-alive já está rodando ou está desabilitado');
            return;
        }

        console.log('🔄 Iniciando keep-alive do frontend...');
        console.log('Backend URL:', KEEP_ALIVE_CONFIG.backendUrl);
        this.isRunning = true;
        this.retryCount = 0;

        // Aguardar 5 segundos antes da primeira requisição
        setTimeout(() => {
            this.ping();
        }, 5000);

        // Configurar requisições periódicas
        this.intervalId = setInterval(() => {
            this.ping();
        }, KEEP_ALIVE_CONFIG.interval);
    }

    /**
     * Para o serviço de keep-alive
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isRunning = false;
            console.log('⏹️ Keep-alive parado');
        }
    }

    /**
     * Faz uma requisição de ping ao backend - VERSÃO CORRIGIDA PARA CORS
     */
    async ping() {
        const timestamp = new Date().toLocaleTimeString();
        
        try {
            console.log(`[${timestamp}] Enviando ping para ${KEEP_ALIVE_CONFIG.backendUrl}/health...`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), KEEP_ALIVE_CONFIG.timeout);

            // VERSÃO CORRIGIDA: Removendo headers problemáticos e adicionando modo CORS
            const response = await fetch(`${KEEP_ALIVE_CONFIG.backendUrl}/health`, {
                method: 'GET',
                mode: 'cors', // Importante: permite CORS
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json' // Apenas header necessário
                    // Removido: Cache-Control e Pragma que causavam problemas CORS
                }
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ [${timestamp}] Keep-alive bem-sucedido! Status:`, data.status);
                this.retryCount = 0; // Resetar contador de tentativas
            } else {
                console.warn(`⚠️ [${timestamp}] Health check retornou status: ${response.status}`);
                this.handleRetry();
            }
            
        } catch (error) {
            console.error(`❌ [${timestamp}] Erro no keep-alive:`, error.message);
            this.handleRetry();
        }
    }

    /**
     * Trata tentativas de retry
     */
    handleRetry() {
        this.retryCount++;
        if (this.retryCount <= KEEP_ALIVE_CONFIG.maxRetries) {
            console.log(`🔄 Tentando novamente... (${this.retryCount}/${KEEP_ALIVE_CONFIG.maxRetries})`);
            setTimeout(() => {
                this.ping();
            }, 30000); // Esperar 30 segundos antes de tentar novamente
        } else {
            console.log('❌ Máximo de tentativas alcançado. Aguardando próximo ciclo.');
            this.retryCount = 0;
        }
    }

    /**
     * Faz uma requisição de wake-up para ativar o serviço
     */
    async wakeUp() {
        try {
            console.log('🚀 Enviando wake-up para o backend...');
            // VERSÃO CORRIGIDA: Removendo headers problemáticos
            const response = await fetch(`${KEEP_ALIVE_CONFIG.backendUrl}/wake-up`, {
                method: 'GET',
                mode: 'cors', // Importante: permite CORS
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Wake-up bem-sucedido:', data);
                return data;
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Wake-up falhou:', error.message);
            throw error;
        }
    }

    /**
     * Testa a conexão com o backend - VERSÃO CORRIGIDA
     */
    async testConnection() {
        console.log('🔍 Testando conexão com o backend...');
        
        const endpoints = ['/health', '/ping', '/wake-up'];
        
        for (const endpoint of endpoints) {
            try {
                // VERSÃO CORRIGIDA: Adicionando modo CORS
                const response = await fetch(`${KEEP_ALIVE_CONFIG.backendUrl}${endpoint}`, {
                    method: 'GET',
                    mode: 'cors'
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ ${endpoint}:`, data);
                } else {
                    console.warn(`⚠️ ${endpoint}: HTTP ${response.status}`);
                }
            } catch (error) {
                console.error(`❌ ${endpoint}:`, error.message);
            }
        }
    }

    /**
     * Verifica se o serviço está rodando
     */
    isActive() {
        return this.isRunning;
    }
}

// Instância global
const keepAliveServiceFixed = new KeepAliveServiceFixed();

// Exportar para uso em outros componentes
export default keepAliveServiceFixed;
export { KeepAliveServiceFixed, KEEP_ALIVE_CONFIG };

// Auto-iniciar apenas em produção - com verificação de ambiente
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Aguardar um pouco antes de iniciar para garantir que a página carregou
    setTimeout(() => {
        keepAliveServiceFixed.start();
    }, 3000);
}
