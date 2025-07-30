import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.verify();
          console.log('Usuario verificado:', response.data.user);
          setUser(response.data.user);
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      // Marcar como inicializado después de verificar
      setLoading(false);
      setInitialized(true);
    };

    // Ejecutar verificación inmediatamente
    checkAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      setError(null);
      
      // Usar la API real de autenticación
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      console.log('Usuario logueado:', user);
      localStorage.setItem('authToken', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = () => {
    // Limpiar inmediatamente sin esperar respuesta del servidor
    localStorage.removeItem('authToken');
    setUser(null);
    setError(null);
    
    // Opcional: hacer la llamada al servidor en segundo plano sin esperar
    authAPI.logout().catch(error => {
      console.error('Error en logout del servidor:', error);
    });
  };

  // Función para cambiar contraseña
  const changePassword = async (passwordData) => {
    try {
      setError(null);
      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al cambiar contraseña';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    changePassword,
    clearError,
    isAuthenticated: !!user,
    initialized,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 