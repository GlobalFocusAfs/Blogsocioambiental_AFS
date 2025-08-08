/**
 * Enhanced image URL utilities to fix 404 errors
 */

// Environment detection
const getEnvironment = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  return 'production';
};

// Base URL configuration
const getBaseUrl = () => {
  const env = getEnvironment();
  
  if (env === 'development') {
    return 'http://localhost:8080';
  }
  
  // Production - Render deployment
  return 'https://blogsocioambiental-afs-1.onrender.com';
};

// Image URL construction with fallback
export const buildImageUrl = (filename) => {
  if (!filename) return null;
  
  // Remove any leading slashes or protocol prefixes
  let cleanFilename = filename.replace(/^https?:\/\//, '');
  cleanFilename = cleanFilename.replace(/^\/+/, '');
  
  // Handle different filename formats
  if (cleanFilename.startsWith('uploads/')) {
    cleanFilename = cleanFilename.replace('uploads/', '');
  }
  
  // Construct final URL
  const baseUrl = getBaseUrl();
  return `${baseUrl}/uploads/${cleanFilename}`;
};

// Image error handler with retry mechanism
export const handleImageError = (event, originalSrc) => {
  console.warn('Image failed to load:', originalSrc);
  
  // Prevent infinite retry loop
  if (event.target.dataset.retryCount >= 2) {
    event.target.src = 'https://via.placeholder.com/400x300?text=Imagem+Indisponível';
    return;
  }
  
  // Increment retry count
  const retryCount = parseInt(event.target.dataset.retryCount || '0') + 1;
  event.target.dataset.retryCount = retryCount;
  
  // Try alternative URL format
  const altUrl = originalSrc.includes('/uploads/') 
    ? originalSrc.replace('/uploads/', '/uploads/')
    : originalSrc;
    
  if (altUrl !== originalSrc) {
    event.target.src = altUrl;
  } else {
    event.target.src = 'https://via.placeholder.com/400x300?text=Imagem+Indisponível';
  }
};

// Check if image exists
export const verifyImageExists = async (filename) => {
  if (!filename) return false;
  
  const imageUrl = buildImageUrl(filename);
  
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking image existence:', error);
    return false;
  }
};

// Get placeholder image
export const getPlaceholderImage = () => {
  return 'https://via.placeholder.com/400x300?text=Imagem+Indisponível';
};

// Validate image filename
export const validateImageFilename = (filename) => {
  if (!filename) return false;
  
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = filename.split('.').pop()?.toLowerCase();
  
  return validExtensions.includes(extension);
};
