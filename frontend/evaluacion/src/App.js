import React from 'react';
import EvaluacionPage from './pages/EvaluacionPage';

// Función para extraer token de la URL
function getTokenFromPathname() {
  const pathname = window.location.pathname;
  
  // Patrón: /evaluar/TOKEN o /TOKEN
  const patterns = [
    /^\/evaluar\/(.+)$/,  // /evaluar/TOKEN
    /^\/([^/]+)$/        // /TOKEN (pero no /evaluar)
  ];
  
  for (const pattern of patterns) {
    const match = pathname.match(pattern);
    if (match) {
      // Evitar que "evaluar" sea tratado como token
      if (match[1] !== 'evaluar') {
        return match[1];
      }
    }
  }
  
  return null;
}

// Función para verificar si estamos en la página de bienvenida
function isWelcomePage() {
  return window.location.pathname === '/evaluar' || window.location.pathname === '/';
}

function App() {
  const token = getTokenFromPathname();
  const isWelcome = isWelcomePage();



  // Si estamos en la página de bienvenida
  if (isWelcome) {
    return <WelcomePage />;
  }

  // Si no hay token, mostrar página de bienvenida
  if (!token) {
    return <WelcomePage />;
  }

  // Si hay token, mostrar la página de evaluación
  return <EvaluacionPage token={token} />;
}

// Página de bienvenida
function WelcomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f5f6fa', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 20 
    }}>
      <div style={{ 
        maxWidth: 500, 
        background: '#fff', 
        borderRadius: 16, 
        padding: 40, 
        textAlign: 'center', 
        boxShadow: '0 4px 24px 0 rgba(30, 42, 73, 0.08)' 
      }}>
        <img 
          src={process.env.PUBLIC_URL + '/logoEmp.png'} 
          alt="Logo" 
          style={{ width: 200, marginBottom: 24 }} 
        />
        <h2 style={{ color: '#1976d2', marginBottom: 16 }}>Sistema de Evaluaciones</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>
          Escanea el código QR o ingresa el enlace proporcionado para evaluar un local.
        </p>
        <div style={{ 
          background: '#f8f9fa', 
          borderRadius: 8, 
          padding: 16, 
          marginTop: 16 
        }}>
          <p style={{ color: '#666', fontSize: 14, margin: 0 }}>
            <strong>¡Tu opinión es importante para nosotros!</strong><br/>
            Ayúdanos a mejorar nuestros servicios.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;