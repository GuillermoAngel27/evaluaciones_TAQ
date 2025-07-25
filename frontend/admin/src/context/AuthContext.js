import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario guardado en localStorage al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Por ahora, usamos autenticación simple
      // En producción, esto debería hacer una llamada al backend
      if (username === 'admin' && password === 'admin123') {
        const userData = {
          id: 1,
          username: 'admin',
          role: 'administrator',
          name: 'Administrador'
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Credenciales inválidas' 
        };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { 
        success: false, 
        error: 'Error de conexión' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminUser');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 