import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  UncontrolledTooltip,
  Alert,
} from "reactstrap";
import {
  FaStar,
  FaSearch,
  FaFilter,
  FaEye,
  FaTrash,
  FaCalendarAlt,
  FaStore,
  FaComments,
  FaUtensils,
  FaCar,
  FaParking,
  FaShoppingBag,
} from "react-icons/fa";

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

  const [modal, setModal] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("all");
  const [imageErrors, setImageErrors] = useState({});

  // Datos de locales evaluados con imágenes más confiables
  const [localesEvaluados, setLocalesEvaluados] = useState([
    {
      id: 1,
      nombre: "Restaurante El Buen Sabor",
      tipo: "alimentos",
      imagen: "https://picsum.photos/400/300?random=1",
      calificacionPromedio: 4.8,
      totalEvaluaciones: 45,
      ultimaEvaluacion: "2024-03-15",
      evaluaciones: [
        { calificacion: 5, comentario: "Excelente servicio y comida deliciosa", fecha: "2024-03-15" },
        { calificacion: 4, comentario: "Muy buena atención", fecha: "2024-03-14" },
      ]
    },
    {
      id: 2,
      nombre: "Café Central",
      tipo: "alimentos",
      imagen: "https://picsum.photos/400/300?random=2",
      calificacionPromedio: 4.2,
      totalEvaluaciones: 32,
      ultimaEvaluacion: "2024-03-14",
      evaluaciones: [
        { calificacion: 4, comentario: "Buen café, ambiente agradable", fecha: "2024-03-14" },
        { calificacion: 3, comentario: "Servicio lento", fecha: "2024-03-13" },
      ]
    },
    {
      id: 3,
      nombre: "Miscelánea La Esquina",
      tipo: "miscelaneas",
      imagen: "https://picsum.photos/400/300?random=3",
      calificacionPromedio: 3.9,
      totalEvaluaciones: 28,
      ultimaEvaluacion: "2024-03-13",
      evaluaciones: [
        { calificacion: 4, comentario: "Bien surtida", fecha: "2024-03-13" },
        { calificacion: 3, comentario: "Precios altos", fecha: "2024-03-12" },
      ]
    },
    {
      id: 4,
      nombre: "Taxi Express",
      tipo: "taxis",
      imagen: "https://picsum.photos/400/300?random=4",
      calificacionPromedio: 4.5,
      totalEvaluaciones: 67,
      ultimaEvaluacion: "2024-03-15",
      evaluaciones: [
        { calificacion: 5, comentario: "Conductor muy amable", fecha: "2024-03-15" },
        { calificacion: 4, comentario: "Llegó rápido", fecha: "2024-03-14" },
      ]
    },
    {
      id: 5,
      nombre: "Estacionamiento Centro",
      tipo: "estacionamiento",
      imagen: "https://picsum.photos/400/300?random=5",
      calificacionPromedio: 3.7,
      totalEvaluaciones: 23,
      ultimaEvaluacion: "2024-03-12",
      evaluaciones: [
        { calificacion: 3, comentario: "Precios altos", fecha: "2024-03-12" },
        { calificacion: 4, comentario: "Bien ubicado", fecha: "2024-03-11" },
      ]
    },
    {
      id: 6,
      nombre: "Pizzería Italia",
      tipo: "alimentos",
      imagen: "https://picsum.photos/400/300?random=6",
      calificacionPromedio: 2.8,
      totalEvaluaciones: 19,
      ultimaEvaluacion: "2024-03-13",
      evaluaciones: [
        { calificacion: 2, comentario: "Pizza fría", fecha: "2024-03-13" },
        { calificacion: 3, comentario: "Servicio lento", fecha: "2024-03-12" },
      ]
    },
    {
      id: 7,
      nombre: "Miscelánea 24/7",
      tipo: "miscelaneas",
      imagen: "https://picsum.photos/400/300?random=7",
      calificacionPromedio: 4.1,
      totalEvaluaciones: 41,
      ultimaEvaluacion: "2024-03-15",
      evaluaciones: [
        { calificacion: 4, comentario: "Abierto 24 horas", fecha: "2024-03-15" },
        { calificacion: 4, comentario: "Buen servicio", fecha: "2024-03-14" },
      ]
    },
    {
      id: 8,
      nombre: "Taxi Seguro",
      tipo: "taxis",
      imagen: "https://picsum.photos/400/300?random=8",
      calificacionPromedio: 4.7,
      totalEvaluaciones: 89,
      ultimaEvaluacion: "2024-03-15",
      evaluaciones: [
        { calificacion: 5, comentario: "Muy seguro", fecha: "2024-03-15" },
        { calificacion: 4, comentario: "Conductor profesional", fecha: "2024-03-14" },
      ]
    }
  ]);

  // Funciones de manejo
  const toggleModal = () => setModal(!modal);

  const handleView = (local) => {
    setSelectedLocal(local);
    toggleModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este local?")) {
      setLocalesEvaluados(localesEvaluados.filter((local) => local.id !== id));
    }
  };

  const handleImageError = (localId) => {
    console.log(`Error loading image for local ${localId}, using placeholder`);
    setImageErrors(prev => ({
      ...prev,
      [localId]: true
    }));
  };

  // Filtrado
  const filteredLocales = localesEvaluados.filter((local) => {
    const matchesSearch = local.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "all" || local.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

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

  return (
    <>
              <div className="header pb-8 pt-5 pt-md-8" style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}>
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <Container className="mt--7" fluid>
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
                  {/* Buscar - Ocupa todo el ancho en móviles y tablets verticales */}
                  <Col xs="12" sm="12" md="12" lg="6" xl="6">
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
                  
                  {/* Tipo - Mitad en móviles, lado a lado en tablets */}
                  <Col xs="6" sm="6" md="6" lg="3" xl="3">
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
                            🏪 Todos los tipos
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
                  
                  {/* Botón Limpiar - Ancho completo en móviles y tablets */}
                  <Col xs="6" sm="6" md="6" lg="3" xl="3">
                    <Button
                      color="secondary"
                      block
                      onClick={() => {
                        setSearchTerm("");
                        setFilterTipo("all");
                      }}
                      style={{ width: '100%' }}
                    >
                      <FaFilter className="mr-1" />
                      Limpiar
                    </Button>
                  </Col>
                </Row>

                {/* Grid de locales */}
                <Row>
                  {filteredLocales.map((local) => (
                    <Col key={local.id} lg="4" md="6" className="mb-4">
                      <Card className="card-lift--hover shadow border-0">
                        <div className="position-relative">
                          <img
                            alt={local.nombre}
                            src={imageErrors[local.id] ? getDefaultImage(local.tipo) : local.imagen}
                            className="card-img-top"
                            style={{ height: "200px", objectFit: "cover" }}
                            onError={() => handleImageError(local.id)}
                            onLoad={() => {
                              // Limpiar el error si la imagen se carga correctamente
                              if (imageErrors[local.id]) {
                                setImageErrors(prev => ({
                                  ...prev,
                                  [local.id]: false
                                }));
                              }
                            }}
                            loading="lazy"
                            crossOrigin="anonymous"
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            <Badge color={getTipoColor(local.tipo)}>
                              {getTipoIcon(local.tipo)}
                              <span className="ms-1">{getTipoNombre(local.tipo)}</span>
                            </Badge>
                          </div>
                        </div>
                        <CardBody className="py-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title mb-0">{local.nombre}</h5>
                            <div className="d-flex">
                              <Button
                                color="info"
                                size="sm"
                                className="mr-1"
                                onClick={() => handleView(local)}
                                id={`view-${local.id}`}
                              >
                                <FaEye />
                              </Button>
                              <UncontrolledTooltip target={`view-${local.id}`}>
                                Ver detalles
                              </UncontrolledTooltip>

                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(local.id)}
                                id={`delete-${local.id}`}
                              >
                                <FaTrash />
                              </Button>
                              <UncontrolledTooltip target={`delete-${local.id}`}>
                                Eliminar
                              </UncontrolledTooltip>
                            </div>
                          </div>
                          
                          <div className="row text-center">
                            <div className="col-6">
                              <div className="text-sm text-muted">Evaluaciones</div>
                              <div className="h5 mb-0">{local.totalEvaluaciones}</div>
                            </div>
                            <div className="col-6">
                              <div className="text-sm text-muted">Calificación</div>
                              <div className="d-flex align-items-center justify-content-center">
                                <div className="me-1">{getRatingStars(local.calificacionPromedio)}</div>
                                <Badge color={getRatingColor(local.calificacionPromedio)} size="sm">
                                  {local.calificacionPromedio.toFixed(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {filteredLocales.length === 0 && (
                  <div className="text-center py-5">
                    <FaStore size={64} className="text-muted mb-3" />
                    <h5 className="text-muted">No se encontraron locales</h5>
                    <p className="text-muted">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal para ver detalles del local */}
      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          Detalles del Local
        </ModalHeader>
        <ModalBody>
          {selectedLocal && (
            <>
              <Row className="mb-4">
                <Col md="6">
                  <img
                    alt={selectedLocal.nombre}
                    src={imageErrors[selectedLocal.id] ? getDefaultImage(selectedLocal.tipo) : selectedLocal.imagen}
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                    onError={() => handleImageError(selectedLocal.id)}
                    onLoad={() => {
                      // Limpiar el error si la imagen se carga correctamente
                      if (imageErrors[selectedLocal.id]) {
                        setImageErrors(prev => ({
                          ...prev,
                          [selectedLocal.id]: false
                        }));
                      }
                    }}
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                </Col>
                <Col md="6">
                  <h4>{selectedLocal.nombre}</h4>
                  <Badge color={getTipoColor(selectedLocal.tipo)} className="mb-2">
                    {getTipoIcon(selectedLocal.tipo)}
                    <span className="ms-1">{getTipoNombre(selectedLocal.tipo)}</span>
                  </Badge>
                  <div className="mb-2">
                    {getRatingStars(selectedLocal.calificacionPromedio)}
                    <span className="ms-2 h5 mb-0">
                      {selectedLocal.calificacionPromedio.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="text-muted">
                    <div>Total de evaluaciones: {selectedLocal.totalEvaluaciones}</div>
                    <div>Última evaluación: {new Date(selectedLocal.ultimaEvaluacion).toLocaleDateString()}</div>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <h6>Evaluaciones Recientes</h6>
                  {selectedLocal.evaluaciones.map((evaluacion, index) => (
                    <Alert key={index} color="light" className="mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="mb-1">{getRatingStars(evaluacion.calificacion)}</div>
                          <div>{evaluacion.comentario}</div>
                        </div>
                        <small className="text-muted">
                          {new Date(evaluacion.fecha).toLocaleDateString()}
                        </small>
                      </div>
                    </Alert>
                  ))}
                </Col>
              </Row>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Evaluaciones; 