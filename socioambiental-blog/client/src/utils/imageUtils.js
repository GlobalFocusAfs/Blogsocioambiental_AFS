// Funções utilitárias para manipulação de imagens

/**
 * Gera a URL completa para uma imagem
 * @param {string} filename - Nome do arquivo da imagem
 * @returns {string} URL completa da imagem
 */
export const getImageUrl = (filename) => {
    if (!filename) return '';
    
    // Usar a URL base do servidor atual
    const baseUrl = window.location.origin;
    
    // Remover barras duplicadas e garantir formato correto
    const cleanFilename = filename.replace(/^\/+/, '');
    
    return `${baseUrl}/uploads/${cleanFilename}`;
};

/**
 * Verifica se uma imagem existe antes de carregar
 * @param {string} url - URL da imagem
 * @returns {Promise<boolean>} Se a imagem existe
 */
export const checkImageExists = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error('Erro ao verificar imagem:', error);
        return false;
    }
};

/**
 * Formata o tamanho do arquivo para exibição
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} Tamanho formatado
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extrai o nome original do arquivo da URL
 * @param {string} url - URL da imagem
 * @returns {string} Nome original do arquivo
 */
export const extractFilename = (url) => {
    if (!url) return '';
    
    const parts = url.split('/');
    return parts[parts.length - 1];
};

// Exportar todas las funciones
export default {
    getImageUrl,
    checkImageExists,
    formatFileSize,
    extractFilename
};
