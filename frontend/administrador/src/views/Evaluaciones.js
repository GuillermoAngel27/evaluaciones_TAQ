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
} from "react-icons/fa";
import { localesAPI } from "../utils/api";

const Evaluaciones = () => {
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
  }, []);

  const cargarLocalesEvaluados = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await localesAPI.getEstadisticas();
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
      const response = await localesAPI.getEvaluacionesDetalladas(local.id);
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
      console.log('Respuestas obtenidas:', response.data);
      console.log('Estructura de respuestas:', response.data.map(r => ({ pregunta: r.pregunta, puntuacion: r.puntuacion })));
      setRespuestas(response.data);
      setModalRespuestas(true);
      console.log('Modal abierto correctamente');
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


  // Filtrado
  const filteredLocales = localesEvaluados.filter((local) => {
    const matchesSearch = local.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "all" || local.tipo === filterTipo;
    
    // Filtrado por fecha
    let matchesFecha = true;
    if (filterFechaDesde || filterFechaHasta) {
      if (!local.ultimaEvaluacion) {
        matchesFecha = false;
      } else {
        const fechaLocal = new Date(local.ultimaEvaluacion);
        
        if (filterFechaDesde) {
          const fechaDesde = new Date(filterFechaDesde);
          matchesFecha = matchesFecha && fechaLocal >= fechaDesde;
        }
        
        if (filterFechaHasta) {
          const fechaHasta = new Date(filterFechaHasta);
          fechaHasta.setHours(23, 59, 59, 999); // Incluir todo el día
          matchesFecha = matchesFecha && fechaLocal <= fechaHasta;
        }
      }
    }
    
    return matchesSearch && matchesTipo && matchesFecha;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLocales = filteredLocales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocales.length / itemsPerPage);

  // Resetear a la primera página cuando cambian los filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTipo, filterFechaDesde, filterFechaHasta]);

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
    switch (tipo) {
      case "alimentos":
        return <FaUtensils size={24} />;
      case "miscelaneas":
        return <FaShoppingBag size={24} />;
      case "taxis":
        return <FaCar size={24} />;
      case "estacionamiento":
        return <FaParking size={24} />;
      default:
        return <FaStore size={24} />;
    }
  };

  const getTipoNombre = (tipo) => {
    switch (tipo) {
      case "alimentos":
        return "Alimentos";
      case "miscelaneas":
        return "Misceláneas";
      case "taxis":
        return "Taxis";
      case "estacionamiento":
        return "Estacionamiento";
      default:
        return "Otro";
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "alimentos":
        return "success";
      case "miscelaneas":
        return "info";
      case "taxis":
        return "warning";
      case "estacionamiento":
        return "secondary";
      default:
        return "primary";
    }
  };

  const getDefaultImage = (tipo) => {
    // Imágenes de placeholder por tipo con colores específicos
    const placeholderImages = {
      alimentos: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23d4edda'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='%23155724'%3E🍽️%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23155724'%3EAlimentos%3C/text%3E%3C/svg%3E",
      miscelaneas: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23d1ecf1'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='%230c5460'%3E🛍️%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%230c5460'%3EMiscelánea%3C/text%3E%3C/svg%3E",
      taxis: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23fff3cd'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='%23856404'%3E🚕%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23856404'%3ETaxi%3C/text%3E%3C/svg%3E",
      estacionamiento: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e2e3e5'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='%23383d41'%3E🅿️%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23383d41'%3EEstacionamiento%3C/text%3E%3C/svg%3E"
    };
    return placeholderImages[tipo] || placeholderImages.alimentos;
  };

  const getPreguntasPorTipo = (tipo) => {
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
    return preguntas[tipo] || preguntas.miscelaneas;
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
                      </h3>
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
                      {evaluacionesDetalladas.map((evaluacion) => (
                        <Col key={evaluacion.id} xs="12" sm="6" md="4" lg="3" className="mb-4">
                          <Card className="card-lift--hover shadow border-0">
                            <CardBody className="py-3">
                              <div className="text-center mb-3">
                                <div className="mb-2">
                                  {getRatingStars(evaluacion.calificacion)}
                                </div>
                                <h6 className="mb-1">{evaluacion.calificacion}/5</h6>
                                <small className="text-muted">
                                  {new Date(evaluacion.fecha).toLocaleDateString()}
                                </small>
                              </div>
                              
                              <div className="text-center">
                                <Button
                                  color="primary"
                                  size="sm"
                                  block
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cargarRespuestasEvaluacion(evaluacion);
                                  }}
                                >
                                  <FaEye className="mr-1" />
                                  Ver Detalles
                                </Button>
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
        <Modal isOpen={modalRespuestas} toggle={toggleModalRespuestas} size="lg">
          <ModalHeader toggle={toggleModalRespuestas}>
            Detalles de la Evaluación
          </ModalHeader>
          <ModalBody>
            {selectedEvaluacion && (
              <>
                {/* Sección del Comentario */}
                <div className="mb-4">
                  <h6>Comentario:</h6>
                  <Alert color="light">
                    {selectedEvaluacion.comentario ? (
                      selectedEvaluacion.comentario
                    ) : (
                      <span className="text-muted">Sin comentarios</span>
                    )}
                  </Alert>
                </div>

                {/* Sección de Preguntas y Respuestas */}
                <div>
                  <h6>Preguntas y Respuestas:</h6>
                  
                  {/* Botón de debug temporal */}
                  <div className="mb-3">
                    <Button
                      color="warning"
                      size="sm"
                      onClick={async () => {
                        try {
                          const response = await localesAPI.debugRespuestas();
                          console.log('Debug - Todas las respuestas:', response.data);
                          alert(`Debug: ${response.data.total} respuestas encontradas. Revisa la consola.`);
                        } catch (err) {
                          console.error('Error en debug:', err);
                          alert('Error en debug: ' + err.message);
                        }
                      }}
                    >
                      Debug: Ver Respuestas en BD
                    </Button>
                  </div>
                  
                  {loadingRespuestas ? (
                    <div className="text-center py-3">
                      <Spinner color="primary" size="sm" className="mr-2" />
                      Cargando respuestas...
                    </div>
                  ) : respuestas.length === 0 ? (
                    <div>
                      <p className="text-muted">No hay respuestas disponibles para esta evaluación.</p>
                      <div className="mt-3">
                        <small className="text-muted">
                          Debug info: Tipo de local: {selectedEvaluacion?.tipoLocal || 'No definido'}, 
                          Respuestas cargadas: {respuestas.length}
                        </small>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-3">
                        <small className="text-muted">
                          Debug: Tipo de local: {selectedEvaluacion?.tipoLocal}, 
                          Respuestas: {respuestas.length}
                        </small>
                      </div>
                      {getPreguntasPorTipo(selectedEvaluacion?.tipoLocal || 'miscelaneas').map((pregunta, index) => {
                        const respuesta = respuestas.find(r => r.pregunta === String(index + 1));
                        console.log(`Pregunta ${index + 1}:`, pregunta, 'Respuesta encontrada:', respuesta);
                        return (
                          <Card key={index} className="mb-3">
                            <CardBody>
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <h6 className="mb-2">{pregunta}</h6>
                                  <div className="d-flex align-items-center">
                                    {respuesta ? (
                                      <span className="h6 mb-0">{respuesta.puntuacion}</span>
                                    ) : (
                                      <span className="text-muted">Sin respuesta</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Información adicional */}
                <div className="mt-4 pt-3 border-top">
                  <div className="row text-muted">
                    <div className="col-6">
                      <small>Fecha: {selectedEvaluacion.fecha}</small>
                    </div>
                    <div className="col-6 text-right">
                      <small>Local: {selectedEvaluacion.nombreLocal}</small>
                    </div>
                  </div>
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModalRespuestas}>
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