import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading, initialized } = useAuth();
  const location = useLocation();

  // Debug: mostrar información de autenticación
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - loading:', loading);
  console.log('ProtectedRoute - initialized:', initialized);
  console.log('ProtectedRoute - location:', location);

  // Mostrar spinner solo si está cargando y no se ha inicializado
  if (loading || !initialized) {
    console.log('Showing loading spinner');
    return <LoadingSpinner text="Verificando autenticación..." />;
  }

  // Si requiere autenticación y no está autenticado, redirigir al login
  if (requireAuth && !isAuthenticated) {
    console.log('Redirecting to login');
    return <Navigate to="/l/login" replace state={{ from: location }} />;
  }

  // Si no requiere autenticación y está autenticado, redirigir al dashboard
  if (!requireAuth && isAuthenticated) {
    console.log('Redirecting to dashboard');
    return <Navigate to="/a/dashboard" replace />;
  }

  // Si todo está bien, mostrar el contenido
  console.log('Rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute; 