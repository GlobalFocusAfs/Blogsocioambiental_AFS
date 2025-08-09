// API Configuration
const API_CONFIG = {
  // For local development
  LOCAL: 'http://localhost:8080',
  // For production
  PRODUCTION: 'https://blogsocioambiental-afs-1.onrender.com',
  // Get current API URL based on environment
  getBaseUrl: () => {
    return process.env.NODE_ENV === 'development' 
      ? API_CONFIG.LOCAL 
      : API_CONFIG.PRODUCTION;
  }
};

export default API_CONFIG;
