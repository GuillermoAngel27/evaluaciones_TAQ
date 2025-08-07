const config = {
  API_URL: process.env.REACT_APP_API_URL || 'https://api.taqro.com.mx/api',
  APP_NAME: 'Sistema de Evaluaciones TAQ',
  VERSION: '1.0.0',
  BASE_URL: process.env.REACT_APP_BASE_URL || 'https://admine.taqro.com.mx',
  ENV: process.env.REACT_APP_ENV || 'production'
};

export default config;
