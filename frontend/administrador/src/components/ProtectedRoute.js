import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading, initialized } = useAuth();
  const location = useLocation();
  const hasRedirected = useRef(false);

  // Evitar redirecciones múltiples
  useEffect(() => {
    hasRedirected.current = false;
  }, [location.pathname]);

  // Mostrar spinner solo si está cargando y no se ha inicializado
  if (loading || !initialized) {
    return <LoadingSpinner text="Verificando autenticación..." />;
  }

  // Si requiere autenticación y no está autenticado, redirigir al login
  if (requireAuth && !isAuthenticated && !hasRedirected.current) {
    hasRedirected.current = true;
    return <Navigate to="/l/login" replace state={{ from: location }} />;
  }

  // Si no requiere autenticación y está autenticado, redirigir al inicio
  if (!requireAuth && isAuthenticated && !hasRedirected.current) {
    hasRedirected.current = true;
    return <Navigate to="/a/inicio" replace />;
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute; 