/**
 * Utilitário de Keep-Alive para o frontend
 * Mantém o backend ativo fazendo requisições periódicas
 */

const KEEP_ALIVE_CONFIG = {
    // URL do backend - ajuste conforme necessário
    backendUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    
    // Intervalo entre requisições (em milissegundos)
    interval: 5 * 60 * 1000, // 5 minutos
    
    // Ativar/desativar o keep-alive
    enabled: true
};

class KeepAliveService {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
    }

    /**
     * Inicia o serviço de keep-alive
     */
    start() {
        if (!KEEP_ALIVE_CONFIG.enabled || this.isRunning) {
            return;
        }

        console.log('🔄 Iniciando keep-alive do frontend...');
        this.isRunning = true;

        // Fazer primeira requisição imediatamente
        this.ping();

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
     * Faz uma requisição de ping ao backend
     */
    async ping() {
        try {
            const response = await fetch(`${KEEP_ALIVE_CONFIG.backendUrl}/health`);
            const data = await response.json();
            console.log('✅ Keep-alive:', data);
        } catch (error) {
            console.warn('⚠️ Keep-alive falhou:', error.message);
            
            // Tentar endpoint mais simples se /health falhar
            try {
                await fetch(`${KEEP_ALIVE_CONFIG.backendUrl}/ping`);
                console.log('✅ Keep-alive alternativo bem-sucedido');
            } catch (pingError) {
                console.error('❌ Keep-alive alternativo falhou:', pingError.message);
            }
        }
    }

    /**
     * Faz uma requisição de wake-up para ativar o serviço
     */
    async wakeUp() {
        try {
            const response = await fetch(`${KEEP_ALIVE_CONFIG.backendUrl}/wake-up`);
            const data = await response.json();
            console.log('🚀 Wake-up:', data);
            return data;
        } catch (error) {
            console.error('❌ Wake-up falhou:', error.message);
            throw error;
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
const keepAliveService = new KeepAliveService();

// Exportar para uso em outros componentes
export default keepAliveService;
export { KeepAliveService, KEEP_ALIVE_CONFIG };

// Auto-iniciar se estiver em produção
if (process.env.NODE_ENV === 'production') {
    // Aguardar um pouco antes de iniciar para garantir que a página carregou
    setTimeout(() => {
        keepAliveService.start();
    }, 5000);
}
