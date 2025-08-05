import React, { useEffect, useState } from 'react';
import PreguntasForm from '../components/PreguntasForm';

// Función para generar un ID único del dispositivo
function generarDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

// Función para guardar token en localStorage
function guardarTokenLocalStorage(localId, tokenInfo) {
  const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
  tokens[localId] = {
    token: tokenInfo.token,
    local_id: tokenInfo.local_id,
    usado: tokenInfo.usado
  };
  localStorage.setItem('tokens', JSON.stringify(tokens));
}

export default function EvaluacionPage({ token }) {
  const tokenPublico = token;
  
  // Debug logs
  console.log('EvaluacionPage - token recibido:', token);
  console.log('EvaluacionPage - tokenPublico:', tokenPublico);
  
  const [local, setLocal] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [evaluacionEnviada, setEvaluacionEnviada] = useState(false);
  const [puedeEvaluar, setPuedeEvaluar] = useState(null); // null: loading, true: puede, false: ya evaluó
  const [deviceId] = useState(generarDeviceId());
  const [tokenInfo, setTokenInfo] = useState(null);
  const [localCargado, setLocalCargado] = useState(false); // Para distinguir entre carga y no encontrado
  const [localInactivo, setLocalInactivo] = useState(false); // Para controlar si el local está inactivo
  const [turnoActual, setTurnoActual] = useState(null); // Para mostrar el turno actual

  // Función para cargar preguntas desde el backend según el tipo de local
  const cargarPreguntas = async (tipoLocal) => {
    
    try {
      const url = `http://localhost:4000/api/evaluaciones/preguntas/${encodeURIComponent(tipoLocal)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      
      const preguntasData = await response.json();
      
      if (!Array.isArray(preguntasData) || preguntasData.length === 0) {
        throw new Error('No se recibieron preguntas válidas del servidor');
      }
      
      const preguntasTexto = preguntasData.map(p => p.pregunta_texto);
      
      setPreguntas(preguntasTexto);
      setRespuestas(Array(preguntasTexto.length).fill(0));
    } catch (error) {
      
      // Fallback: usar preguntas básicas según el tipo de local
      let preguntasBasicas = [];
      
      // Normalizar el tipo de local para el fallback
      const tipoLower = tipoLocal?.toLowerCase() || '';
      
      if (tipoLower.includes('alimento')) {
        preguntasBasicas = [
          "¿El personal fue amable?",
          "¿El local estaba limpio?",
          "¿La atención fue rápida?",
          "¿Al finalizar su compra le entregaron ticket?",
          "¿La relación calidad-precio fue adecuada?"
        ];
      } else if (tipoLower.includes('taxi')) {
        preguntasBasicas = [
          "¿El personal fue amable?",
          "¿Las instalaciones se encuentra limpias?",
          "¿La asignación de unidad fue rápida?",
          "¿Las instalaciones son adecuadas para realizar el abordaje?"
        ];
      } else if (tipoLower.includes('estacionamiento') || tipoLower.includes('parking')) {
        preguntasBasicas = [
          "¿El personal fue amable?",
          "¿Las instalaciones se encuentran limpias?",
          "¿El acceso a las instalaciones son adecuadas?",
          "¿El proceso para pago fue optimo?"
        ];
      } else {
        // Fallback genérico para Miscelánea y otros tipos
        preguntasBasicas = [
          "¿El personal fue amable?",
          "¿El local estaba limpio?",
          "¿La atención fue rápida?",
          "¿Al finalizar su compra le entregaron ticket?"
        ];
      }
      
      setPreguntas(preguntasBasicas);
      setRespuestas(Array(preguntasBasicas.length).fill(0));
    }
  };

  // Función para obtener el turno actual
  const obtenerTurnoActual = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/evaluaciones/turno-actual');
      if (response.ok) {
        const data = await response.json();
        setTurnoActual(data.turno);
      }
    } catch (error) {
      console.error('Error obteniendo turno actual:', error);
      // Fallback en caso de error
      setTurnoActual('Turno 1');
    }
  };

  // Al cargar la página, consulta al backend si puede evaluar
  useEffect(() => {
    if (!tokenPublico) return;
    
    console.log('EvaluacionPage - Consultando local con token:', tokenPublico);
    
    // Obtener turno actual
    obtenerTurnoActual();
    
    // Cargar información del local por token_publico (ruta pública)
    fetch(`http://localhost:4000/api/locales/public/token/${tokenPublico}`)
      .then(res => {
        console.log('EvaluacionPage - Respuesta del servidor:', res.status, res.statusText);
        if (!res.ok) {
          if (res.status === 404) {
            // Token inválido - local no existe
            console.log('EvaluacionPage - Local no encontrado (404)');
            setLocal(null);
            setLocalCargado(true);
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (!data) {
          // Token inválido - no se encontró el local
          setLocal(null);
          setLocalCargado(true);
          return;
        }
        
        if (data.estatus !== 'Activo') {
          // Local existe pero está inactivo
          setLocalInactivo(true);
          setLocal(data);
          setLocalCargado(true);
          return;
        }
        
        // Local existe y está activo
        // Cargar preguntas dinámicamente según el tipo de local
        if (data.tipo_local) {
          cargarPreguntas(data.tipo_local);
        } else {
          // Fallback si no tiene tipo_local
          const preguntasBasicas = [
            "¿El personal fue amable?",
            "¿El local estaba limpio?",
            "¿La atención fue rápida?"
          ];
          setPreguntas(preguntasBasicas);
          setRespuestas(Array(preguntasBasicas.length).fill(0));
        }
        setLocal(data);
        setLocalCargado(true);
      })
      .catch(err => {
        console.error('Error cargando local:', err);
        setError("Error al cargar información del local");
        setLocal(null);
        setLocalCargado(true);
      });
  }, [tokenPublico]);

  // Verificar si puede evaluar después de que el local esté cargado
  useEffect(() => {
    if (!local || !local.id || localInactivo || !localCargado) return;
    
    fetch("http://localhost:4000/api/tokens/verificar-evaluacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ local_id: parseInt(local.id), device_id: deviceId })
    })
      .then(res => res.json())
      .then(data => {
        setPuedeEvaluar(!!data.puede_evaluar);
      })
      .catch(err => {
        setPuedeEvaluar(false);
      });
  }, [local, localInactivo, deviceId, localCargado]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError("");
    
    if (respuestas.some(r => r === 0)) {
      setError("Por favor responde todas las preguntas antes de enviar.");
      setEnviando(false);
      return;
    }
    // Validar que todas las respuestas sean enteros del 1 al 5
    if (!respuestas.every(r => Number.isInteger(Number(r)) && Number(r) >= 1 && Number(r) <= 5)) {
      setError("Las respuestas deben ser enteros del 1 al 5.");
      setEnviando(false);
      return;
    }
    
    try {
      let tokenParaUsar = null;
      if (tokenInfo && tokenInfo.token) {
        tokenParaUsar = tokenInfo.token;
      } else {
        // Generar token si no existe
        const response = await fetch("http://localhost:4000/api/tokens/generar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ local_id: parseInt(local.id), device_id: deviceId })
        });
        const data = await response.json();
        tokenParaUsar = data.token;
        setTokenInfo({ token: data.token, local_id: data.local_id, usado: false });
        guardarTokenLocalStorage(local.id, { token: data.token, local_id: data.local_id, usado: false });
      }
      
      const response = await fetch("http://localhost:4000/api/evaluaciones/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenParaUsar,
          device_id: deviceId,
          respuestas: respuestas.map(Number),
          preguntas,
          comentario,
          turno: turnoActual || 'Turno 1' // Agregar el turno actual
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar evaluación');
      }
      
      await fetch("http://localhost:4000/api/tokens/usar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenParaUsar, device_id: deviceId })
      });
      
      setEvaluacionEnviada(true);
      setPuedeEvaluar(false);
    } catch (err) {
      setError(err.message || "Error al enviar la evaluación.");
    }
    setEnviando(false);
  };

  if (!tokenPublico) {
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
          <h2 style={{ color: '#1976d2', marginBottom: 16 }}>Token no especificado</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>
            No se ha especificado el local a evaluar.
          </p>
          <div style={{ 
            background: '#f8f9fa', 
            borderRadius: 8, 
            padding: 16, 
            marginTop: 16 
          }}>
            <p style={{ color: '#666', fontSize: 14, margin: 0 }}>
              <strong>Formato correcto:</strong><br/>
              http://localhost:3001/evaluar/TOKEN_DEL_LOCAL<br/>
              o<br/>
              http://localhost:3001/TOKEN_DEL_LOCAL
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Mostrar mensaje si el local está inactivo
  if (localInactivo && local) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f6fa', padding: 0, margin: 0 }}>
        <div style={{ maxWidth: 500, width: '95vw', margin: "0 auto", padding: 0, background: 'transparent', borderRadius: 24, textAlign: 'center', boxSizing: 'border-box' }}>
          <style>{`
            .error-card {
              background: #fff;
              box-shadow: 0 4px 24px 0 rgba(30, 42, 73, 0.08);
              border-radius: 24px;
              padding: 32px 24px 32px 24px;
              margin-top: 40px;
              margin-bottom: 40px;
            }
            .error-header {
              background: linear-gradient(135deg,rgb(255, 193, 7) 0%,rgb(255, 152, 0) 100%);
              margin: -32px -24px 32px -24px;
              padding: 24px;
              border-radius: 24px 24px 0 0;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .error-header-title {
              color: #fff;
              font-size: 26px;
              font-weight: 600;
              margin: 0;
              flex: 1;
              text-align: center;
            }
            .error-header-logo {
              width: 120px;
              height: auto;
              margin-left: 0;
            }
            .error-content {
              text-align: center;
              padding: 20px 0;
            }
            .error-icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
            .error-message {
              color: #f57c00;
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 16px;
            }
            .error-details {
              color: #666;
              font-size: 16px;
              margin-bottom: 24px;
            }
            .error-help {
              background: #fff3e0;
              border-radius: 8px;
              padding: 16px;
              margin-top: 20px;
            }
            .error-help-text {
              color: #e65100;
              font-size: 14px;
              margin: 0;
            }
          `}</style>
          <div className="error-card">
            <div className="error-header">
              <img className="error-header-logo" src={process.env.PUBLIC_URL + '/logoEmp.png'} alt="Logo" />
              <h2 className="error-header-title">
                Local Temporalmente No Disponible
              </h2>
            </div>
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <div className="error-message">No se pueden recibir evaluaciones</div>
              <div className="error-details">
                El local <strong>{local.nombre}</strong> se encuentra temporalmente inactivo.
              </div>
              <div className="error-help">
                <p className="error-help-text">
                  Por favor, intenta más tarde cuando el local esté disponible nuevamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Mostrar error 404 si el local no existe (token inválido)
  if (localCargado && !local) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f6fa', padding: 0, margin: 0 }}>
        <div style={{ maxWidth: 500, width: '95vw', margin: "0 auto", padding: 0, background: 'transparent', borderRadius: 24, textAlign: 'center', boxSizing: 'border-box' }}>
          <style>{`
            .error-card {
              background: #fff;
              box-shadow: 0 4px 24px 0 rgba(30, 42, 73, 0.08);
              border-radius: 24px;
              padding: 32px 24px 32px 24px;
              margin-top: 40px;
              margin-bottom: 40px;
            }
            .error-header {
              background: linear-gradient(135deg,rgb(222, 230, 193) 0%,rgb(166, 234, 221) 100%);
              margin: -32px -24px 32px -24px;
              padding: 24px;
              border-radius: 24px 24px 0 0;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .error-header-title {
              color: #fff;
              font-size: 26px;
              font-weight: 600;
              margin: 0;
              flex: 1;
              text-align: center;
            }
            .error-header-logo {
              width: 120px;
              height: auto;
              margin-left: 0;
            }
            .error-content {
              text-align: center;
              padding: 20px 0;
            }
            .error-icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
            .error-message {
              color: #d32f2f;
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 16px;
            }
            .error-details {
              color: #666;
              font-size: 16px;
              margin-bottom: 24px;
            }
            .error-help {
              background: #f5f5f5;
              border-radius: 8px;
              padding: 16px;
              margin-top: 20px;
            }
            .error-help-text {
              color: #666;
              font-size: 14px;
              margin: 0;
            }
          `}</style>
          <div className="error-card">
            <div className="error-header">
              <img className="error-header-logo" src={process.env.PUBLIC_URL + '/logoEmp.png'} alt="Logo" />
              <h2 className="error-header-title">
              </h2>
            </div>
            <div className="error-content">
              <img src={process.env.PUBLIC_URL + '/error.png'} alt="Error" style={{ width: 320, margin: '0 auto 20px auto', display: 'block' }} />
              <div className="error-message">¡Ups! Error 404</div>
              <div className="error-details">
              </div>
              <div className="error-help">
                <p className="error-help-text">
                  Lo sentimos, la página que buscas no existe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (puedeEvaluar === null && localCargado && local) {
    return (
      <div style={{ maxWidth: 500, margin: "40px auto", padding: 32, background: "#fff", boxShadow: "0 2px 8px #eee", borderRadius: 16, textAlign: 'center' }}>
        <h2 style={{ color: '#1976d2' }}>Preparando evaluación...</h2>
        <div style={{ marginTop: 32 }}>
          <div style={{ color: '#666' }}>
            Verificando evaluación previa...
          </div>
          <div style={{ marginTop: 16, fontSize: '14px', color: '#999' }}>Esto solo tomará un momento</div>
        </div>
      </div>
    );
  }
  
  if (!local && !localCargado) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ maxWidth: 400, background: '#fff', borderRadius: 16, padding: 40, textAlign: 'center', boxShadow: '0 4px 24px 0 rgba(30, 42, 73, 0.08)' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>⏳</div>
          <h2 style={{ color: '#1976d2', marginBottom: 16, fontSize: 24 }}>Cargando local...</h2>
          <p style={{ color: '#666', fontSize: 16 }}>Estamos preparando la evaluación para ti</p>
        </div>
      </div>
    );
  }

  if (!puedeEvaluar || evaluacionEnviada) {
    return (
      <div style={{ maxWidth: 500, width: '95vw', margin: "40px auto", padding: 16, background: "#fff", boxShadow: "0 2px 8px #eee", borderRadius: 16, textAlign: 'center', boxSizing: 'border-box' }}>
        <style>{`
          @media (max-width: 600px) {
            .agradecimiento-header { font-size: 18px !important; padding: 14px 0 10px 0 !important; }
            .agradecimiento-img { width: 120px !important; }
            .agradecimiento-titulo { font-size: 18px !important; }
            .agradecimiento-mensaje { font-size: 13px !important; }
          }
          @media (min-width: 601px) and (max-width: 900px) {
            .agradecimiento-header { font-size: 22px !important; padding: 18px 0 12px 0 !important; }
            .agradecimiento-img { width: 180px !important; }
            .agradecimiento-titulo { font-size: 22px !important; }
            .agradecimiento-mensaje { font-size: 15px !important; }
          }
          @media (min-width: 901px) {
            .agradecimiento-header { font-size: 24px !important; padding: 20px 0 16px 0 !important; }
            .agradecimiento-img { width: 220px !important; }
            .agradecimiento-titulo { font-size: 26px !important; }
            .agradecimiento-mensaje { font-size: 16px !important; }
          }
        `}</style>
        <div className="agradecimiento-header" style={{ background: '#1976d2', color: '#fff', borderRadius: '12px 12px 0 0', padding: '20px 0 16px 0', margin: '-16px -16px 24px -16px', fontSize: 24, fontWeight: 700, letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={process.env.PUBLIC_URL + '/logoemp.png'} alt="Logo" style={{ width: 120, height: 'auto', marginLeft: 16 }} />
          <span style={{ flex: 1, textAlign: 'center', marginRight: 136 }}>¡Evaluación enviada!</span>
        </div>
        <h2 className="agradecimiento-titulo" style={{ color: '#1976d2', marginTop: 0, fontSize: 26 }}>{local ? local.nombre : ''} evaluado!</h2>
        <img className="agradecimiento-img" src={process.env.PUBLIC_URL + '/gracias.png'} alt="Gracias" style={{ width: 220, margin: '24px auto 0', display: 'block', maxWidth: '100%' }} />
        <div style={{ color: '#1976d2', fontWeight: 'bold', marginTop: 32, fontSize: '18px' }}>
          ¡Gracias por tu evaluación!
        </div>
        <div className="agradecimiento-mensaje" style={{ fontSize: 16, color: '#444', marginTop: 16 }}>
          Tu opinión es muy importante para nosotros.
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa', padding: 0, margin: 0 }}>
      <div style={{ maxWidth: 500, width: '95vw', margin: "0 auto", padding: 0, background: 'transparent', borderRadius: 24, textAlign: 'center', boxSizing: 'border-box' }}>
        <style>{`
          @media (max-width: 600px) {
            .form-logo { width: 180px !important; margin: 12px auto 18px auto !important; }
            .form-titulo { font-size: 18px !important; margin-top: 18px !important; }
            .form-label, .form-textarea, .form-btn { font-size: 14px !important; }
            .form-btn { padding: 10px 0 !important; }
          }
          @media (min-width: 601px) and (max-width: 900px) {
            .form-logo { width: 240px !important; margin: 18px auto 24px auto !important; }
            .form-titulo { font-size: 22px !important; margin-top: 22px !important; }
            .form-label, .form-textarea, .form-btn { font-size: 16px !important; }
            .form-btn { padding: 12px 0 !important; }
          }
          @media (min-width: 901px) {
            .form-logo { width: 320px !important; margin: 24px auto 32px auto !important; }
            .form-titulo { font-size: 26px !important; margin-top: 26px !important; }
            .form-label, .form-textarea, .form-btn { font-size: 18px !important; }
            .form-btn { padding: 14px 0 !important; }
          }
          .form-card {
            background: #fff;
            box-shadow: 0 4px 24px 0 rgba(30, 42, 73, 0.08);
            border-radius: 24px;
            padding: 32px 24px 32px 24px;
            margin-top: 40px;
            margin-bottom: 40px;
          }
          .form-header {
            background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
            margin: -32px -24px 32px -24px;
            padding: 24px;
            border-radius: 24px 24px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .form-header-title {
            color: #fff;
            font-size: 26px;
            font-weight: 600;
            margin: 0;
            flex: 1;
            text-align: center;
          }
          .form-header-logo {
            width: 120px;
            height: auto;
            margin-left: 0;
          }
          .form-label {
            color: #263238;
            font-weight: 500;
            margin-bottom: 6px;
            display: block;
          }
          .form-textarea, .form-input {
            background: #f7fafd;
            border: 1.5px solid #cfd8dc;
            border-radius: 10px;
            padding: 10px 12px;
            font-size: 18px;
            color: #263238;
            width: 100%;
            box-sizing: border-box;
            transition: border 0.2s;
            outline: none;
            margin-bottom: 8px;
          }
          .form-textarea:focus, .form-input:focus {
            border: 1.5px solid #1976d2;
            background: #fff;
          }
          .form-btn {
            background: #1976d2;
            color: #fff;
            border: none;
            border-radius: 10px;
            padding: 16px 0;
            font-size: 18px;
            font-weight: bold;
            width: 100%;
            margin-top: 12px;
            cursor: pointer;
            box-shadow: 0 2px 8px 0 rgba(25, 118, 210, 0.08);
            transition: background 0.2s, box-shadow 0.2s;
          }
          .form-btn:hover:not(:disabled) {
            background: #125ea7;
            box-shadow: 0 4px 16px 0 rgba(25, 118, 210, 0.13);
          }
        `}</style>
        <div className="form-card">
          <div className="form-header">
            <img className="form-header-logo" src={process.env.PUBLIC_URL + '/logoEmp.png'} alt="Logo" />
            <h2 className="form-header-title">
              Evaluar: {local.nombre}
            </h2>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <div style={{ textAlign: 'left' }}>
              <PreguntasForm preguntas={preguntas} respuestas={respuestas} setRespuestas={setRespuestas} />
            </div>
            {error && <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>{error}</div>}
            <div style={{ margin: "24px 0" }}>
              <label className="form-label">Comentario (opcional):</label>
              <textarea
                className="form-textarea"
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                rows={3}
                placeholder="¿Algo más que quieras contarnos?"
              />
            </div>
            <button type="submit" disabled={enviando} className="form-btn">
              {enviando ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 