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

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Para desarrollo, simular un usuario autenticado
          // const response = await authAPI.verify();
          // setUser(response.data.user);
          setUser({ id: 1, name: 'Admin', email: 'admin@example.com' });
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          localStorage.removeItem('authToken');
        }
      }
      // Siempre establecer loading en false, incluso si hay errores
      setLoading(false);
    };

    // Agregar un timeout para evitar que se quede colgado
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    checkAuth().finally(() => {
      clearTimeout(timeoutId);
    });
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      setError(null);
      
      // Para desarrollo: credenciales hardcodeadas
      if (credentials.email === 'admin' && credentials.password === 'admin1234') {
        const user = { id: 1, name: 'Admin', email: 'admin@example.com' };
        const token = 'dev-token-' + Date.now();
        
        localStorage.setItem('authToken', token);
        setUser(user);
        
        return { success: true };
      } else {
        throw new Error('Credenciales inválidas');
      }
      
      // Para producción, usar la API real:
      // const response = await authAPI.login(credentials);
      // const { token, user } = response.data;
      // localStorage.setItem('authToken', token);
      // setUser(user);
      // return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setError(null);
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (passwordData) => {
    try {
      setError(null);
      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar contraseña';
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 