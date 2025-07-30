import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();
  
  const isAdmin = user?.rol === 'administrador';
  const isNormal = user?.rol === 'normal';
  
  return {
    // Permisos generales
    isAdmin,
    isNormal,
    
    // Gestión de usuarios (solo administradores)
    canManageUsers: isAdmin,
    canCreateUsers: isAdmin,
    canEditUsers: isAdmin,
    canDeleteUsers: isAdmin,
    canChangeUserPassword: isAdmin,
    
    // Gestión de locales
    canViewLocales: true, // Ambos roles pueden ver
    canCreateLocales: isAdmin,
    canEditLocales: isAdmin,
    canDeleteLocales: isAdmin,
    canGenerateTokens: true, // Ambos roles pueden generar QR
    
    // Gestión de evaluaciones
    canViewEvaluations: true, // Ambos roles pueden ver
    canDeleteEvaluations: isAdmin,
    canViewEvaluationDetails: true, // Ambos roles pueden ver detalles
    
    // Estadísticas
    canViewStats: true, // Ambos roles pueden ver estadísticas básicas
    canViewAdvancedStats: isAdmin, // Solo admin puede ver estadísticas avanzadas
    
    // Configuración del sistema
    canManageSystem: isAdmin,
    
    // Funciones de utilidad
    hasRole: (roles) => {
      if (!user) return false;
      if (Array.isArray(roles)) {
        return roles.includes(user.rol);
      }
      return user.rol === roles;
    },
    
    // Verificar si tiene al menos uno de los permisos especificados
    hasAnyPermission: (permissions) => {
      if (!user) return false;
      return permissions.some(permission => {
        switch (permission) {
          case 'manage_users':
            return isAdmin;
          case 'manage_locales':
            return isAdmin;
          case 'delete_evaluations':
            return isAdmin;
          case 'view_stats':
            return true;
          case 'advanced_stats':
            return isAdmin;
          default:
            return false;
        }
      });
    },
    
    // Verificar si tiene todos los permisos especificados
    hasAllPermissions: (permissions) => {
      if (!user) return false;
      return permissions.every(permission => {
        switch (permission) {
          case 'manage_users':
            return isAdmin;
          case 'manage_locales':
            return isAdmin;
          case 'delete_evaluations':
            return isAdmin;
          case 'view_stats':
            return true;
          case 'advanced_stats':
            return isAdmin;
          default:
            return false;
        }
      });
    }
  };
}; 