/**
 * Utilitários para gerar URLs corretas de imagens em diferentes ambientes
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://blogsocioambiental-afs-1.onrender.com';

/**
 * Gera URL completa para imagem nas pré-visualizações
 * @param {string} imagePath - caminho ou nome da imagem
 * @returns {string} URL completa da imagem
 */
export const getPreviewImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Se já for uma URL completa (http ou https), retorna como está
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Se for uma URL relativa, converte para URL absoluta
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // Se for apenas o nome do arquivo, monta a URL completa
  return `${API_BASE_URL}/uploads/${imagePath}`;
};

/**
 * Verifica se a imagem existe antes de exibir
 * @param {string} imageUrl - URL da imagem
 * @returns {Promise<string>} URL válida ou placeholder
 */
export const validateImageUrl = async (imageUrl) => {
  if (!imageUrl) return '';
  
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok ? imageUrl : '';
  } catch (error) {
    console.error('Erro ao validar imagem:', error);
    return '';
  }
};

/**
 * Retorna placeholder para imagens quebradas
 */
export const getImagePlaceholder = () => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbSBuw6NvIGVuc29yYWRhPC90ZXh0Pgo8L3N2Zz4K';
};
