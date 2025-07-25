import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return <LoadingSpinner text="Verificando autenticación..." />;
  }

  // Si requiere autenticación y no está autenticado, redirigir al login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Si no requiere autenticación y está autenticado, redirigir al dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/admin/index" replace />;
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute; 