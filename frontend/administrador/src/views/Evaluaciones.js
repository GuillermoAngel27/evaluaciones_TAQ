import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Badge,
  Form,
  FormGroup,
  Input,
  Alert,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  FaStar,
  FaSearch,
  FaFilter,
  FaStore,
  FaUtensils,
  FaCar,
  FaParking,
  FaShoppingBag,
  FaArrowLeft,
  FaEye,
  FaComments,
  FaQuestionCircle,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { localesAPI, evaluacionesAPI } from "../utils/api";

const Evaluaciones = () => {
  // Función de utilidad para formatear fechas
  const formatearFecha = (fechaString) => {
    try {
      console.log('Formateando fecha original:', fechaString);
      
      // Si la fecha del backend está en UTC, necesitamos convertirla a hora local de México
      // Asumir que el backend envía en formato YYYY-MM-DD HH:mm:ss en UTC
      // y queremos convertir a hora local de México (UTC-6)
      
      // Crear fecha UTC
      const fechaUTC = new Date(fechaString + 'Z');
      console.log('Fecha UTC interpretada:', fechaUTC.toISOString());
      
      // Obtener la diferencia de zona horaria del navegador
      const offsetNavegador = fechaUTC.getTimezoneOffset(); // en minutos
      console.log('Offset del navegador (minutos):', offsetNavegador);
      
      // Offset para México (UTC-6 = +360 minutos)
      const offsetMexico = 360; // 6 horas * 60 minutos
      console.log('Offset México (minutos):', offsetMexico);
      
      // Calcular la diferencia total
      const offsetTotal = offsetMexico - offsetNavegador;
      console.log('Offset total (minutos):', offsetTotal);
      
      // Aplicar la corrección
      const fechaLocal = new Date(fechaUTC.getTime() + (offsetTotal * 60 * 1000));
      console.log('Fecha local corregida:', fechaLocal);
      
      const day = fechaLocal.getDate().toString().padStart(2, '0');
      const month = fechaLocal.getMonth();
      const year = fechaLocal.getFullYear();
      const hour = fechaLocal.getHours();
      const minute = fechaLocal.getMinutes();
      
      console.log('Componentes finales:', { day, month, year, hour, minute });
      
      const monthNames = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      
      // Convertir a formato AM/PM
      let hour12, ampm;
      
      if (hour === 0) {
        hour12 = 12;
        ampm = 'AM';
      } else if (hour === 12) {
        hour12 = 12;
        ampm = 'PM';
      } else if (hour > 12) {
        hour12 = hour - 12;
        ampm = 'PM';
      } else {
        hour12 = hour;
        ampm = 'AM';
      }
      
      // Agregar cero al inicio si la hora es menor a 10
      const formattedHour = hour12 < 10 ? `0${hour12}` : hour12;
      const formattedMinute = minute < 10 ? `0${minute}` : minute;
      
      const resultado = `${day}-${monthNames[month]}-${year} ${formattedHour}:${formattedMinute} ${ampm}`;
      console.log('Fecha formateada final:', resultado);
      
      return resultado;
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return fechaString; // Retornar el string original si hay error
    }
  };

  // Estilos CSS personalizados para dropdowns modernos
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .modern-select {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e") !important;
        background-position: right 12px center !important;
        background-repeat: no-repeat !important;
        background-size: 16px !important;
        padding-right: 40px !important;
      }
      
      .modern-select:hover {
        border-color: #5A0C62 !important;
        box-shadow: 0 4px 12px rgba(90, 12, 98, 0.15) !important;
        transform: translateY(-1px) !important;
      }
      
      .modern-select:focus {
        border-color: #DC017F !important;
        box-shadow: 0 0 0 3px rgba(220, 1, 127, 0.1) !important;
        outline: none !important;
      }
      
      .custom-select-wrapper {
        position: relative;
      }
      
      .modern-select option {
        padding: 12px 16px !important;
        font-weight: 500 !important;
        background: white !important;
        color: #495057 !important;
      }
      
      .modern-select option:hover {
        background: linear-gradient(135deg, #5A0C62 0%, #DC017F 100%) !important;
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("all");
  const [filterFechaDesde, setFilterFechaDesde] = useState("");
  const [filterFechaHasta, setFilterFechaHasta] = useState("");
  const [filterTurno, setFilterTurno] = useState("all");
  const [turnos, setTurnos] = useState([]);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // 3 renglones x 4 columnas

  // Estados para datos reales
  const [localesEvaluados, setLocalesEvaluados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para vista de evaluaciones detalladas
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [evaluacionesDetalladas, setEvaluacionesDetalladas] = useState([]);
  const [loadingEvaluaciones, setLoadingEvaluaciones] = useState(false);
  const [showEvaluacionesDetalladas, setShowEvaluacionesDetalladas] = useState(false);
  
  // Estados para modal de respuestas
  const [modalRespuestas, setModalRespuestas] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [loadingRespuestas, setLoadingRespuestas] = useState(false);

  // Cargar datos de locales con evaluaciones
  useEffect(() => {
    cargarLocalesEvaluados();
  }, [filterFechaDesde, filterFechaHasta]);

  // Cargar turnos al iniciar el componente
  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    try {
      setLoadingTurnos(true);
      const response = await evaluacionesAPI.getTurnos();
      console.log('Turnos cargados:', response.data);
      setTurnos(response.data);
    } catch (err) {
      console.error('Error cargando turnos:', err);
      // Fallback con turnos básicos si hay error
      setTurnos([
        { id: 1, texto: 'Turno 1 (Mañana)' },
        { id: 2, texto: 'Turno 2 (Tarde)' },
        { id: 3, texto: 'Turno 3 - Madrugada (00:00 - 05:30)' },
        { id: 4, texto: 'Turno 3 - Noche (21:00 - 24:00)' }
      ]);
    } finally {
      setLoadingTurnos(false);
    }
  };

  const cargarLocalesEvaluados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir parámetros de consulta para filtros de fecha
      const params = new URLSearchParams();
      if (filterFechaDesde) params.append('fechaDesde', filterFechaDesde);
      if (filterFechaHasta) params.append('fechaHasta', filterFechaHasta);
      
      const response = await localesAPI.getEstadisticas(params.toString());
      console.log('Datos de locales evaluados:', response.data);
      setLocalesEvaluados(response.data);
    } catch (err) {
      console.error('Error cargando locales evaluados:', err);
      setError('Error al cargar los datos de evaluaciones');
    } finally {
      setLoading(false);
    }
  };

  const cargarEvaluacionesDetalladas = async (local) => {
    try {
      setLoadingEvaluaciones(true);
      setSelectedLocal(local);
      
      // Resetear el filtro de turnos a "Todos los turnos"
      setFilterTurno("all");
      
      // Construir parámetros de consulta para filtros de fecha
      const params = new URLSearchParams();
      if (filterFechaDesde) params.append('fechaDesde', filterFechaDesde);
      if (filterFechaHasta) params.append('fechaHasta', filterFechaHasta);
      
      const response = await localesAPI.getEvaluacionesDetalladas(local.id, params.toString());
      setEvaluacionesDetalladas(response.data);
      setShowEvaluacionesDetalladas(true);
    } catch (err) {
      console.error('Error cargando evaluaciones detalladas:', err);
      setError('Error al cargar las evaluaciones detalladas');
    } finally {
      setLoadingEvaluaciones(false);
    }
  };

  const cargarRespuestasEvaluacion = async (evaluacion) => {
    console.log('Iniciando carga de respuestas para evaluación:', evaluacion);
    try {
      setLoadingRespuestas(true);
      // Asegurar que la evaluación tenga el tipo de local
      const evaluacionConTipo = {
        ...evaluacion,
        tipoLocal: evaluacion.tipoLocal || selectedLocal?.tipo
      };
      setSelectedEvaluacion(evaluacionConTipo);
      console.log('Llamando API para obtener respuestas de evaluación ID:', evaluacion.id);
      const response = await localesAPI.getRespuestasEvaluacion(evaluacion.id);
      setRespuestas(response.data);
      setModalRespuestas(true);
    } catch (err) {
      console.error('Error cargando respuestas:', err);
      setError('Error al cargar las respuestas de la evaluación');
    } finally {
      setLoadingRespuestas(false);
    }
  };

  const volverALocales = () => {
    setShowEvaluacionesDetalladas(false);
    setSelectedLocal(null);
    setEvaluacionesDetalladas([]);
    // Resetear el filtro de turnos a "Todos los turnos"
    setFilterTurno("all");
    // Limpiar estados del modal
    setModalRespuestas(false);
    setSelectedEvaluacion(null);
    setRespuestas([]);
  };

  const toggleModalRespuestas = () => {
    if (modalRespuestas) {
      // Cerrar modal
      setModalRespuestas(false);
      setSelectedEvaluacion(null);
      setRespuestas([]);
    } else {
      // Abrir modal (no debería pasar aquí, pero por seguridad)
      setModalRespuestas(true);
    }
  };


  // Filtrado (solo búsqueda y tipo, las fechas se filtran en el backend)
  const filteredLocales = localesEvaluados.filter((local) => {
    const matchesSearch = local.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "all" || local.tipo === filterTipo;
    
    return matchesSearch && matchesTipo;
  });
  
  console.log(`Total locales del backend: ${localesEvaluados.length}`);
  console.log(`Locales filtrados por búsqueda/tipo: ${filteredLocales.length}`);
  console.log(`Filtros activos:`, {
    searchTerm,
    filterTipo,
    filterFechaDesde,
    filterFechaHasta
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLocales = filteredLocales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocales.length / itemsPerPage);

  // Resetear a la primera página cuando cambian los filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTipo, filterFechaDesde, filterFechaHasta, filterTurno]);

  // Funciones de utilidad
  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`${i <= rating ? "text-warning" : "text-muted"}`}
          size={16}
        />
      );
    }
    return stars;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "info";
    if (rating >= 2) return "warning";
    return "danger";
  };

  const getTipoIcon = (tipo) => {
    const tipoNormalizado = tipo?.toLowerCase() || 'miscelaneas';
    
    switch (tipoNormalizado) {
      case "alimentos":
        return <FaUtensils size={24} />;
      case "miscelaneas":
        return <FaShoppingBag size={24} />;
      case "taxis":
        return <FaCar size={24} />;
      case "estacionamiento":
        return <FaParking size={24} />;
      default:
        return <FaShoppingBag size={24} />; // Fallback a miscelaneas
    }
  };

  const getTipoNombre = (tipo) => {
    // Normalizar el tipo recibido (por si acaso)
    const tipoNormalizado = tipo?.toLowerCase() || 'miscelaneas';
    
    switch (tipoNormalizado) {
      case "alimentos":
        return "Alimentos";
      case "miscelaneas":
        return "Misceláneas";
      case "taxis":
        return "Taxis";
      case "estacionamiento":
        return "Estacionamiento";
      default:
        return "Misceláneas"; // Fallback más apropiado
    }
  };

  const getTipoColor = (tipo) => {
    const tipoNormalizado = tipo?.toLowerCase() || 'miscelaneas';
    
    switch (tipoNormalizado) {
      case "alimentos":
        return "success";
      case "miscelaneas":
        return "info";
      case "taxis":
        return "warning";
      case "estacionamiento":
        return "secondary";
      default:
        return "info"; // Fallback a miscelaneas
    }
  };

  const getDefaultImage = (tipo) => {
    const tipoNormalizado = tipo?.toLowerCase() || 'miscelaneas';
    
    // Imágenes de placeholder por tipo con colores específicos
    const placeholderImages = {
      alimentos: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23d4edda'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='%23155724'%3E🍽️%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23155724'%3EAlimentos%3C/text%3E%3C/svg%3E",
      miscelaneas: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23d1ecf1'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='%230c5460'%3E🛍️%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%230c5460'%3EMiscelánea%3C/text%3E%3C/svg%3E",
      taxis: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23fff3cd'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='%23856404'%3E🚕%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23856404'%3ETaxi%3C/text%3E%3C/svg%3E",
      estacionamiento: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e2e3e5'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='%23383d41'%3E🅿️%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23383d41'%3EEstacionamiento%3C/text%3E%3C/svg%3E"
    };
    return placeholderImages[tipoNormalizado] || placeholderImages.miscelaneas;
  };

  const getPreguntasPorTipo = (tipo) => {
    const tipoNormalizado = tipo?.toLowerCase() || 'miscelaneas';
    
    const preguntas = {
      alimentos: [
        "¿El personal fue amable?",
        "¿El local estaba limpio?",
        "¿La atención fue rápida?",
        "¿Al finalizar su compra le entregaron ticket?",
        "¿La relación calidad-precio fue adecuada?"
      ],
      miscelaneas: [
        "¿El personal fue amable?",
        "¿El local estaba limpio?",
        "¿La atención fue rápida?",
        "¿Al finalizar su compra le entregaron ticket?"
      ],
      taxis: [
        "¿El personal fue amable?",
        "¿Las instalaciones se encuentra limpias?",
        "¿La asignación de unidad fue rápida?",
        "¿Las instalaciones son adecuadas para realizar el abordaje?"
      ],
      estacionamiento: [
        "¿El personal fue amable?",
        "¿Las instalaciones se encuentran limpias?",
        "¿El acceso a las instalaciones son adecuadas?",
        "¿El proceso para pago fue optimo?"
      ]
    };
    return preguntas[tipoNormalizado] || preguntas.miscelaneas;
  };

  // Función para obtener el texto del turno
  const getTurnoTexto = (turno, turnoEspecifico = null) => {
    // Si tenemos un turno específico, usarlo
    if (turnoEspecifico) {
      switch (turnoEspecifico) {
        case '3-madrugada':
          return 'Turno 3 - Madrugada (00:00 - 05:30)';
        case '3-noche':
          return 'Turno 3 - Noche (21:00 - 24:00)';
        default:
          break;
      }
    }
    
    // Fallback al turno numérico
    switch (turno) {
      case 1:
        return 'Turno 1 (Mañana)';
      case 2:
        return 'Turno 2 (Tarde)';
      case 3:
        return 'Turno 3';
      default:
        return typeof turno === 'string' ? turno : `Turno ${turno}`;
    }
  };

  // Función para obtener el color del turno
  const getTurnoColor = (turno, turnoEspecifico = null) => {
    // Si tenemos un turno específico, asignar colores diferentes
    if (turnoEspecifico) {
      switch (turnoEspecifico) {
        case '3-madrugada':
          return 'warning'; // Naranja
        case '3-noche':
          return 'info'; // Morado/Azul claro
        default:
          break;
      }
    }
    
    // Fallback al turno numérico
    switch (turno) {
      case 1:
        return 'primary'; // Azul
      case 2:
        return 'success'; // Verde
      case 3:
        return 'warning'; // Naranja
      default:
        return 'secondary';
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <>
        <div className="header pb-8 pt-5 pt-md-8" style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}>
          <Container fluid>
            <div className="header-body">
              <Row>
                <Col>
                  <h6 className="h2 text-white d-inline-block mb-0"></h6>
                </Col>
              </Row>
            </div>
          </Container>
        </div>

        <Container className="mt--8" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody className="text-center py-5">
                  <Spinner color="primary" size="lg" className="mb-3" />
                  <h5>Cargando evaluaciones...</h5>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <>
        <div className="header pb-8 pt-5 pt-md-8" style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}>
          <Container fluid>
            <div className="header-body">
              <Row>
                <Col>
                  <h6 className="h2 text-white d-inline-block mb-0"></h6>
                </Col>
              </Row>
            </div>
          </Container>
        </div>

        <Container className="mt--8" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody className="text-center py-5">
                  <Alert color="danger">
                    <h5>Error al cargar los datos</h5>
                    <p>{error}</p>
                    <Button color="primary" onClick={cargarLocalesEvaluados}>
                      Reintentar
                    </Button>
                  </Alert>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  // Vista de evaluaciones detalladas
  if (showEvaluacionesDetalladas) {
    return (
      <>
        <div className="header pb-8 pt-5 pt-md-8" style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}>
          <Container fluid>
            <div className="header-body">
              <Row>
                <Col>
                  <h6 className="h2 text-white d-inline-block mb-0"></h6>
                </Col>
              </Row>
            </div>
          </Container>
        </div>

        <Container className="mt--8" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <Button
                        color="link"
                        onClick={volverALocales}
                        className="p-0 mr-3"
                      >
                        <FaArrowLeft size={20} />
                      </Button>
                      <h3 className="mb-0 d-inline-block">
                        Evaluaciones de {selectedLocal?.nombre}
                        {filterTurno !== "all" && (
                          <small className="text-muted ml-2">
                            ({evaluacionesDetalladas.filter(e => {
                              if (filterTurno === "3-madrugada" || filterTurno === "3-noche") {
                                return e.turno_especifico === filterTurno;
                              }
                              return e.turno === parseInt(filterTurno);
                            }).length} del {getTurnoTexto(parseInt(filterTurno), filterTurno)})
                          </small>
                        )}
                      </h3>
                    </div>
                    <div className="col-auto">
                      <FormGroup className="mb-0">
                        <Input
                          type="select"
                          value={filterTurno}
                          onChange={(e) => setFilterTurno(e.target.value)}
                          className="form-control-alternative modern-select"
                          style={{
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                            border: '2px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#495057',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            minWidth: '200px'
                          }}
                          disabled={loadingTurnos}
                        >
                          <option value="all">🕐 Todos los turnos</option>
                          {turnos.map((turno) => (
                            <option key={turno.id} value={turno.id}>
                              {turno.id === '1' ? '☀️' : 
                               turno.id === '2' ? '⏰' : 
                               turno.id === '3-madrugada' ? '🌅' : 
                               turno.id === '3-noche' ? '🌙' : '🕐'} {turno.texto}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {loadingEvaluaciones ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" size="lg" className="mb-3" />
                      <h5>Cargando evaluaciones...</h5>
                    </div>
                  ) : evaluacionesDetalladas.length === 0 ? (
                    <div className="text-center py-5">
                      <FaStore size={64} className="text-muted mb-3" />
                      <h5 className="text-muted">No hay evaluaciones para este local</h5>
                    </div>
                                    ) : (
                    <Row>
                      {evaluacionesDetalladas
                        .filter(evaluacion => {
                          if (filterTurno === "all") return true;
                          
                          // Si el filtro es para turno 3 específico
                          if (filterTurno === "3-madrugada" || filterTurno === "3-noche") {
                            return evaluacion.turno_especifico === filterTurno;
                          }
                          
                          // Para otros turnos, comparar por número
                          return evaluacion.turno === parseInt(filterTurno);
                        })
                        .map((evaluacion) => (
                        <Col key={evaluacion.id} xs="12" sm="6" md="4" lg="3" className="mb-4">
                          <Card 
                            className="shadow border-0" 
                            style={{ 
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              transform: 'translateY(0)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-8px)';
                              e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
                            }}
                            onClick={() => cargarRespuestasEvaluacion(evaluacion)}
                          >
                            <CardBody className="py-3" style={{ userSelect: 'none', pointerEvents: 'none' }}>
                              <div className="text-center mb-3">
                                <div className="mb-2">
                                  {getRatingStars(evaluacion.calificacion)}
                                </div>
                                <h6 className="mb-1">{evaluacion.calificacion}/5</h6>
                                <small className="text-muted">
                                  {formatearFecha(evaluacion.fecha)}
                                </small>
                                {evaluacion.turno && (
                                  <div className="mt-2">
                                    <Badge 
                                      color={getTurnoColor(evaluacion.turno, evaluacion.turno_especifico)}
                                      className="badge-pill"
                                      style={{ fontSize: '11px' }}
                                    >
                                      {getTurnoTexto(evaluacion.turno, evaluacion.turno_especifico)}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-center">
                                <small className="text-muted">Haz clic para ver detalles</small>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Modal de Respuestas */}
        <Modal isOpen={modalRespuestas} toggle={toggleModalRespuestas} size="lg" className="modal-dialog-centered">
          <ModalHeader className="text-white border-0 position-relative" style={{background: 'linear-gradient(135deg, rgb(90, 12, 98) 0%, rgb(220, 1, 127) 100%)'}}>
                          <div className="d-flex align-items-center">
                <FaEye className="mr-2 text-white" size={20} />
                <h4 className="mb-0 text-white">Detalles de la Evaluación</h4>
              </div>
            <button 
              type="button" 
              className="btn-close text-white position-absolute" 
              aria-label="Close"
              onClick={toggleModalRespuestas}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                top: '15px',
                right: '15px'
              }}
            >
              ×
            </button>
          </ModalHeader>
          <ModalBody className="p-4">
            {selectedEvaluacion && (
              <>
                {/* Información del header */}
                <div className="mb-4 p-3 bg-light rounded">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <FaStore className="mr-2 text-primary" />
                        <strong>{selectedEvaluacion.nombreLocal}</strong>
                      </div>
                      <small className="text-muted">
                        <FaCalendarAlt className="mr-1" />
                        {formatearFecha(selectedEvaluacion.fecha)}
                      </small>
                      {selectedEvaluacion.turno && (
                        <div className="mt-1">
                          <Badge 
                            color={getTurnoColor(selectedEvaluacion.turno, selectedEvaluacion.turno_especifico)}
                            className="badge-pill"
                            style={{ fontSize: '12px' }}
                          >
                            {getTurnoTexto(selectedEvaluacion.turno, selectedEvaluacion.turno_especifico)}
                          </Badge>
                        </div>
                      )}
                      {!selectedEvaluacion.turno && (
                        <div className="mt-1">
                          <small className="text-muted">Sin información de turno</small>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 text-md-right">
                      <div className="d-flex align-items-center justify-content-md-end">
                        <span className="badge badge-primary badge-pill mr-2">
                          {getTipoNombre(selectedEvaluacion.tipoLocal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección del Comentario */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaComments className="mr-2 text-info" />
                    <h5 className="mb-0">Comentario</h5>
                  </div>
                  <div className="p-3 bg-light rounded border-left border-info" style={{borderLeftWidth: '4px'}}>
                    {selectedEvaluacion.comentario ? (
                      <p className="mb-0 text-dark">{selectedEvaluacion.comentario}</p>
                    ) : (
                      <p className="mb-0 text-muted font-italic">Sin comentarios</p>
                    )}
                  </div>
                </div>

                {/* Sección de Preguntas y Respuestas */}
                <div>
                  <div className="d-flex align-items-center mb-3">
                    <FaQuestionCircle className="mr-2 text-success" />
                    <h5 className="mb-0">Preguntas y Respuestas</h5>
                  </div>
                  
                  {loadingRespuestas ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" size="lg" className="mb-3" />
                      <p className="text-muted">Cargando respuestas...</p>
                    </div>
                  ) : respuestas.length === 0 ? (
                    <div className="text-center py-4">
                      <FaExclamationTriangle className="text-warning mb-3" size={48} />
                      <p className="text-muted">No hay respuestas disponibles para esta evaluación.</p>
                    </div>
                  ) : (
                    <div className="row">
                      {getPreguntasPorTipo(selectedEvaluacion?.tipoLocal || 'miscelaneas').map((pregunta, index) => {
                        const respuesta = respuestas.find(r => r.pregunta === String(index + 1));
                        return (
                          <Col key={index} xs="12" className="mb-3">
                            <Card className="border-0 shadow-sm">
                              <CardBody className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-start">
                                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mr-3" 
                                           style={{width: '32px', height: '32px', minWidth: '32px'}}>
                                        <span className="font-weight-bold">{index + 1}</span>
                                      </div>
                                                                             <div className="flex-grow-1">
                                         <h5 className="mb-2 text-dark">{pregunta}</h5>
                                        <div className="d-flex align-items-center">
                                          {respuesta ? (
                                            <div className="d-flex align-items-center">
                                              <div className="bg-success text-white rounded-pill px-3 py-1 mr-2">
                                                <span className="font-weight-bold">{respuesta.puntuacion}</span>
                                              </div>
                                              <small className="text-muted">puntos</small>
                                            </div>
                                          ) : (
                                            <span className="text-muted font-italic">Sin respuesta</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter className="border-0 bg-light">
            <Button color="secondary" onClick={toggleModalRespuestas} className="px-4">
              <FaTimes className="mr-1" />
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }

  return (
    <>
      <div className="header pb-8 pt-5 pt-md-8" style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}>
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col>
                <h6 className="h2 text-white d-inline-block mb-0"></h6>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <Container className="mt--8" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Locales Evaluados</h3>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                
                
                {/* Filtros y búsqueda */}
                <Row className="mb-4 g-3">
                  {/* Buscar - Ocupa todo el ancho en móviles */}
                  <Col xs="12" sm="12" md="6" lg="4" xl="3">
                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Buscar por nombre de local..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control-alternative"
                      />
                    </FormGroup>
                  </Col>
                  
                  {/* Tipo - Mitad en móviles */}
                  <Col xs="6" sm="6" md="3" lg="2" xl="2">
                    <FormGroup>
                      <div className="custom-select-wrapper">
                        <Input
                          type="select"
                          value={filterTipo}
                          onChange={(e) => setFilterTipo(e.target.value)}
                          className="form-control-alternative modern-select"
                          style={{
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                            border: '2px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#495057',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          <option value="all" style={{ fontWeight: '600', color: '#6c757d' }}>
                            🏪 Todos
                          </option>
                          <option value="alimentos" style={{ fontWeight: '500' }}>
                            🍽️ Alimentos
                          </option>
                          <option value="miscelaneas" style={{ fontWeight: '500' }}>
                            🛒 Misceláneas
                          </option>
                          <option value="taxis" style={{ fontWeight: '500' }}>
                            🚕 Taxis
                          </option>
                          <option value="estacionamiento" style={{ fontWeight: '500' }}>
                            🅿️ Estacionamiento
                          </option>
                        </Input>
                      </div>
                    </FormGroup>
                  </Col>
                  
                  {/* Fecha Desde */}
                  <Col xs="6" sm="6" md="3" lg="2" xl="2">
                    <FormGroup>
                      <Input
                        type="date"
                        value={filterFechaDesde}
                        onChange={(e) => {
                          setFilterFechaDesde(e.target.value);
                          // Si la fecha "hasta" es anterior a la nueva fecha "de", limpiarla
                          if (filterFechaHasta && e.target.value && filterFechaHasta < e.target.value) {
                            setFilterFechaHasta("");
                          }
                        }}
                        className="form-control-alternative"
                        style={{
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          border: '2px solid #e9ecef',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#495057',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </FormGroup>
                  </Col>
                  
                  {/* Fecha Hasta */}
                  <Col xs="6" sm="6" md="3" lg="2" xl="2">
                    <FormGroup>
                      <Input
                        type="date"
                        value={filterFechaHasta}
                        onChange={(e) => setFilterFechaHasta(e.target.value)}
                        min={filterFechaDesde} // Establece el mínimo basado en la fecha "de"
                        className="form-control-alternative"
                        style={{
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          border: '2px solid #e9ecef',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#495057',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </FormGroup>
                  </Col>
                  
                  {/* Botón Limpiar */}
                  <Col xs="6" sm="6" md="3" lg="2" xl="3">
                    <Button
                      color="secondary"
                      block
                      onClick={() => {
                        setSearchTerm("");
                        setFilterTipo("all");
                        setFilterFechaDesde("");
                        setFilterFechaHasta("");
                        setFilterTurno("all");
                        setCurrentPage(1);
                      }}
                      style={{ 
                        width: '100px',
                        padding: '12px 16px'
                      }}
                    >
                      <FaFilter className="mr-1" />
                      Limpiar
                    </Button>
                  </Col>
                </Row>

                {/* Grid de locales */}
                <Row>
                  {currentLocales.map((local) => (
                    <Col key={local.id} xs="12" sm="6" md="4" lg="3" className="mb-4">
                      <Card 
                        className="card-lift--hover shadow border-0" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => cargarEvaluacionesDetalladas(local)}
                      >
                        <div className="position-relative">
                          <img
                            alt={local.nombre}
                            src={getDefaultImage(local.tipo)}
                            className="card-img-top"
                            style={{ height: "200px", objectFit: "cover" }}
                            loading="lazy"
                          />
                        </div>
                        <CardBody className="py-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title mb-0">{local.nombre}</h5>
                          </div>
                          
                          <div className="row text-center">
                            <div className="col-6">
                              <div className="text-sm text-muted">Evaluaciones</div>
                              <div className="h5 mb-0">{local.totalEvaluaciones}</div>
                            </div>
                            <div className="col-6">
                              <div className="text-sm text-muted">Calificación</div>
                              <div className="d-flex align-items-center justify-content-center">
                                {local.calificacionPromedio > 0 ? (
                                  getRatingStars(local.calificacionPromedio)
                                ) : (
                                  <span className="text-muted">Sin evaluaciones</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center mt-3">
                            <small className="text-muted">Haz clic para ver evaluaciones</small>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* Paginación */}
                {totalPages > 1 && (
                  <Row className="mt-4">
                    <Col>
                      <div className="d-flex justify-content-end align-items-center">
                        {/* Controles de paginación */}
                        <nav aria-label="Paginación de evaluaciones">
                          <ul className="pagination pagination-sm mb-0">
                            {/* Botón Anterior */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button
                                className="page-link border-0"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{
                                  borderRadius: '8px',
                                  margin: '0 2px',
                                  padding: '8px 12px',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  color: currentPage === 1 ? '#6c757d' : '#495057',
                                  backgroundColor: currentPage === 1 ? '#f8f9fa' : 'white',
                                  border: '1px solid #e9ecef',
                                  transition: 'all 0.2s ease',
                                  minWidth: '36px',
                                  height: '36px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                  if (currentPage !== 1) {
                                    e.target.style.backgroundColor = '#f8f9fa';
                                    e.target.style.transform = 'translateY(-1px)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (currentPage !== 1) {
                                    e.target.style.backgroundColor = 'white';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                  }
                                }}
                              >
                                <span style={{ fontSize: '12px' }}>«</span>
                              </button>
                            </li>
                            
                            {/* Números de página */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <li key={page} className="page-item">
                                <button
                                  className="page-link border-0"
                                  onClick={() => setCurrentPage(page)}
                                  style={{
                                    borderRadius: '8px',
                                    margin: '0 2px',
                                    padding: '8px 12px',
                                    fontSize: '14px',
                                    fontWeight: page === currentPage ? '600' : '500',
                                    color: page === currentPage ? 'white' : '#495057',
                                    backgroundColor: page === currentPage 
                                      ? 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' 
                                      : 'white',
                                    border: page === currentPage 
                                      ? '1px solid #5A0C62' 
                                      : '1px solid #e9ecef',
                                    transition: 'all 0.2s ease',
                                    minWidth: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: page === currentPage 
                                      ? 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' 
                                      : 'white'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (page !== currentPage) {
                                      e.target.style.backgroundColor = '#f8f9fa';
                                      e.target.style.transform = 'translateY(-1px)';
                                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (page !== currentPage) {
                                      e.target.style.backgroundColor = 'white';
                                      e.target.style.transform = 'translateY(0)';
                                      e.target.style.boxShadow = 'none';
                                    }
                                  }}
                                >
                                  {page}
                                </button>
                              </li>
                            ))}
                            
                            {/* Botón Siguiente */}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                              <button
                                className="page-link border-0"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                style={{
                                  borderRadius: '8px',
                                  margin: '0 2px',
                                  padding: '8px 12px',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  color: currentPage === totalPages ? '#6c757d' : '#495057',
                                  backgroundColor: currentPage === totalPages ? '#f8f9fa' : 'white',
                                  border: '1px solid #e9ecef',
                                  transition: 'all 0.2s ease',
                                  minWidth: '36px',
                                  height: '36px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                  if (currentPage !== totalPages) {
                                    e.target.style.backgroundColor = '#f8f9fa';
                                    e.target.style.transform = 'translateY(-1px)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (currentPage !== totalPages) {
                                    e.target.style.backgroundColor = 'white';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                  }
                                }}
                              >
                                <span style={{ fontSize: '12px' }}>»</span>
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </Col>
                  </Row>
                )}

                {filteredLocales.length === 0 && (
                  <div className="text-center py-5">
                    <FaStore size={64} className="text-muted mb-3" />
                    <h5 className="text-muted">
                      {localesEvaluados.length === 0 
                        ? "No hay locales con evaluaciones" 
                        : "No se encontraron locales"
                      }
                    </h5>
                    <p className="text-muted">
                      {localesEvaluados.length === 0 
                        ? "Los locales aparecerán aquí una vez que reciban evaluaciones" 
                        : "Intenta ajustar los filtros de búsqueda"
                      }
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Evaluaciones; 