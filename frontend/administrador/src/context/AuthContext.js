import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const verificationTimeoutRef = useRef(null);
  const lastVerificationRef = useRef(0);

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Evitar verificaciones múltiples en un corto período
        const now = Date.now();
        if (now - lastVerificationRef.current < 2000) {
          // Si la última verificación fue hace menos de 2 segundos, esperar
          if (verificationTimeoutRef.current) {
            clearTimeout(verificationTimeoutRef.current);
          }
          verificationTimeoutRef.current = setTimeout(checkAuth, 2000);
          return;
        }
        
        lastVerificationRef.current = now;
        
        // Verificar autenticación usando cookies (se envían automáticamente)
        const response = await authAPI.verify();
        setUser(response.data.user);
      } catch (error) {
        // Si hay error, el usuario no está autenticado
        setUser(null);
      } finally {
        // Marcar como inicializado después de verificar
        setLoading(false);
        setInitialized(true);
      }
    };

    // Ejecutar verificación inmediatamente
    checkAuth();

    // Cleanup function
    return () => {
      if (verificationTimeoutRef.current) {
        clearTimeout(verificationTimeoutRef.current);
      }
    };
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      // Usar la API real de autenticación
      const response = await authAPI.login(credentials);
      const { user } = response.data; // El token se maneja automáticamente en cookies
      
      setUser(user);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      setLoading(true);
      // Hacer logout en el servidor (esto también limpia la cookie)
      await authAPI.logout();
    } catch (error) {
      // Ignorar errores de logout silenciosamente
    } finally {
      // Limpiar estado local
      setUser(null);
      setError(null);
      setLoading(false);
    }
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