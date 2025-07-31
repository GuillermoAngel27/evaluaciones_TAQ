import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Funciones de API para evaluaciones
export const evaluacionesAPI = {
  // Obtener todas las evaluaciones
  getAll: () => api.get('/evaluaciones'),
  
  // Obtener evaluación por ID
  getById: (id) => api.get(`/evaluaciones/${id}`),
  
  // Crear nueva evaluación
  create: (data) => api.post('/evaluaciones', data),
  
  // Actualizar evaluación
  update: (id, data) => api.put(`/evaluaciones/${id}`, data),
  
  // Eliminar evaluación
  delete: (id) => api.delete(`/evaluaciones/${id}`),
  
  // Obtener estadísticas
  getStats: () => api.get('/evaluaciones/stats'),
};

// Funciones de API para locales
export const localesAPI = {
  // Obtener todos los locales
  getAll: () => api.get('/locales'),
  
  // Obtener local por ID
  getById: (id) => api.get(`/locales/${id}`),
  
  // Crear nuevo local
  create: (data) => api.post('/locales', data),
  
  // Actualizar local
  update: (id, data) => api.put(`/locales/${id}`, data),
  
  // Eliminar local
  delete: (id) => api.delete(`/locales/${id}`),
  
  // Obtener local por token_publico
  getByToken: (token) => api.get(`/locales/token/${token}`),
  
  // Obtener locales con estadísticas de evaluaciones
  getEstadisticas: (params = '') => api.get(`/locales/evaluaciones/estadisticas${params ? `?${params}` : ''}`),
  
  // Obtener evaluaciones detalladas de un local
  getEvaluacionesDetalladas: (id, params = '') => api.get(`/locales/${id}/evaluaciones-detalladas${params ? `?${params}` : ''}`),
  
  // Obtener respuestas de una evaluación específica
  getRespuestasEvaluacion: (evaluacionId) => api.get(`/locales/evaluacion/${evaluacionId}/respuestas`),
  
  // Debug: Ver todas las respuestas (solo para desarrollo)
  debugRespuestas: () => api.get('/locales/debug/respuestas'),
};

// Funciones de API para autenticación
export const authAPI = {
  // Login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Verificar token
  verify: () => api.get('/auth/verify'),
  
  // Cambiar contraseña
  changePassword: (data) => api.put('/auth/password', data),
};

// Funciones de API para usuarios
export const usuariosAPI = {
  // Obtener todos los usuarios
  getAll: () => api.get('/usuarios'),
  
  // Obtener usuario por ID
  getById: (id) => api.get(`/usuarios/${id}`),
  
  // Crear nuevo usuario
  create: (data) => api.post('/usuarios', data),
  
  // Actualizar usuario
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  
  // Cambiar contraseña de usuario
  changePassword: (id, data) => api.put(`/usuarios/${id}/password`, data),
  
  // Eliminar usuario
  delete: (id) => api.delete(`/usuarios/${id}`),
};

export default api; 