import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Table,
  Badge,
  FormGroup,
  Input,
  Button,
} from "reactstrap";
import {
  FaStar,
  FaSearch,
  FaFilter,
  FaUtensils,
  FaShoppingBag,
  FaCar,
  FaParking,
  FaStore,
} from "react-icons/fa";

const Estadisticas = () => {
  // Estados para el primer formulario (tabla de locales)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("all");

  // Estados para el segundo formulario (filtros por tipo y preguntas)
  const [selectedTipo, setSelectedTipo] = useState("all");
  const [selectedPregunta, setSelectedPregunta] = useState("all");

  // Datos de ejemplo para locales con evaluaciones
  const [localesData] = useState([
    {
      id: 1,
      nombre: "Restaurante El Buen Sabor",
      tipo: "Alimentos",
      promedio: 4.8,
      evaluaciones: 45,
      estatus: "Activo"
    },
    {
      id: 2,
      nombre: "Café Central",
      tipo: "Alimentos",
      promedio: 4.2,
      evaluaciones: 32,
      estatus: "Activo"
    },
    {
      id: 3,
      nombre: "Miscelánea La Esquina",
      tipo: "Misceláneas",
      promedio: 2.9,
      evaluaciones: 28,
      estatus: "Activo"
    },
    {
      id: 4,
      nombre: "Taxi Express",
      tipo: "Taxis",
      promedio: 4.5,
      evaluaciones: 67,
      estatus: "Activo"
    },
    {
      id: 5,
      nombre: "Estacionamiento Centro",
      tipo: "Estacionamiento",
      promedio: 2.7,
      evaluaciones: 23,
      estatus: "Activo"
    },
    {
      id: 6,
      nombre: "Pizzería Italia",
      tipo: "Alimentos",
      promedio: 2.8,
      evaluaciones: 19,
      estatus: "Inactivo"
    },
    {
      id: 7,
      nombre: "Miscelánea 24/7",
      tipo: "Misceláneas",
      promedio: 4.1,
      evaluaciones: 41,
      estatus: "Activo"
    },
    {
      id: 8,
      nombre: "Taxi Seguro",
      tipo: "Taxis",
      promedio: 4.7,
      evaluaciones: 89,
      estatus: "Activo"
    }
  ]);

  // Datos de ejemplo para preguntas por tipo de local
  const preguntasPorTipo = {
    "Alimentos": [
      "¿Qué tan satisfecho está con la calidad de la comida?",
      "¿Cómo calificaría el servicio al cliente?",
      "¿Qué opina sobre la limpieza del establecimiento?",
      "¿Recomendaría este lugar a otros?",
      "¿Cómo calificaría la relación calidad-precio?"
    ],
    "Misceláneas": [
      "¿Qué tan satisfecho está con la variedad de productos?",
      "¿Cómo calificaría la atención del personal?",
      "¿Qué opina sobre los precios?",
      "¿Recomendaría esta tienda?",
      "¿Cómo calificaría la limpieza del local?"
    ],
    "Taxis": [
      "¿Qué tan satisfecho está con la puntualidad?",
      "¿Cómo calificaría la seguridad del viaje?",
      "¿Qué opina sobre la limpieza del vehículo?",
      "¿Recomendaría este servicio?",
      "¿Cómo calificaría la amabilidad del conductor?"
    ],
    "Estacionamiento": [
      "¿Qué tan satisfecho está con la seguridad?",
      "¿Cómo calificaría la facilidad de acceso?",
      "¿Qué opina sobre los precios?",
      "¿Recomendaría este estacionamiento?",
      "¿Cómo calificaría la limpieza del área?"
    ]
  };

  // Datos de ejemplo para respuestas por pregunta
  const [respuestasPorPregunta] = useState({
    "¿Qué tan satisfecho está con la calidad de la comida?": [
      { local: "Restaurante El Buen Sabor", calificacion: 5, comentario: "Excelente comida" },
      { local: "Café Central", calificacion: 4, comentario: "Muy buena calidad" },
      { local: "Pizzería Italia", calificacion: 2, comentario: "Comida fría" }
    ],
    "¿Cómo calificaría el servicio al cliente?": [
      { local: "Restaurante El Buen Sabor", calificacion: 5, comentario: "Servicio excepcional" },
      { local: "Café Central", calificacion: 3, comentario: "Servicio lento" },
      { local: "Pizzería Italia", calificacion: 2, comentario: "Muy lento" }
    ]
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

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "Alimentos":
        return <FaUtensils size={20} />;
      case "Misceláneas":
        return <FaShoppingBag size={20} />;
      case "Taxis":
        return <FaCar size={20} />;
      case "Estacionamiento":
        return <FaParking size={20} />;
      default:
        return <FaStore size={20} />;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "Alimentos":
        return "success";
      case "Misceláneas":
        return "info";
      case "Taxis":
        return "warning";
      case "Estacionamiento":
        return "secondary";
      default:
        return "primary";
    }
  };

  // Filtrado para el primer formulario
  const filteredLocales = localesData.filter((local) => {
    const matchesSearch = local.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "all" || local.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  // Filtrado para el segundo formulario
  const getPreguntasDisponibles = () => {
    if (selectedTipo === "all") {
      return Object.values(preguntasPorTipo).flat();
    }
    return preguntasPorTipo[selectedTipo] || [];
  };

  const getRespuestasFiltradas = () => {
    if (selectedPregunta === "all") return [];
    return respuestasPorPregunta[selectedPregunta] || [];
  };

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
        {/* Primer Formulario: Tabla de Locales */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Estadísticas Generales de Locales</h3>
              </CardHeader>
              <CardBody>
                {/* Filtros */}
                <Row className="mb-4 g-2">
                  <Col xs="12" sm="6" md="5" lg="5" xl="5">
                    <FormGroup className="mb-0">
                      <Input
                        type="text"
                        placeholder="Buscar por nombre de local..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                  
                  <Col xs="6" sm="3" md="3" lg="3" xl="3">
                    <FormGroup className="mb-0">
                      <Input
                        type="select"
                        value={filterTipo}
                        onChange={(e) => setFilterTipo(e.target.value)}
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
                      >
                        <option value="all">Todos</option>
                        <option value="Alimentos">Alimentos</option>
                        <option value="Misceláneas">Misceláneas</option>
                        <option value="Taxis">Taxis</option>
                        <option value="Estacionamiento">Estacionamiento</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  
                  <Col xs="6" sm="3" md="2" lg="2" xl="2">
                    <FormGroup className="mb-0">
                      <Button
                        color="secondary"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterTipo("all");
                        }}
                        style={{ 
                          width: '100%',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        <FaFilter className="mr-1" />
                        Limpiar
                      </Button>
                    </FormGroup>
                  </Col>
                  
                  <Col xs="12" sm="12" md="2" lg="2" xl="2">
                    <FormGroup className="mb-0">
                      <div className="d-flex justify-content-end">
                        <Badge color="info" className="px-3 py-2">
                          {filteredLocales.length} locales
                        </Badge>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>

                {/* Tabla de Locales */}
                <div className="table-responsive">
                  <Table className="align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Local</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Promedio</th>
                        <th scope="col">Evaluaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLocales.map((local) => (
                        <tr 
                          key={local.id}
                          style={{
                            backgroundColor: local.promedio <= 3 ? '#fff5f5' : 'transparent'
                          }}
                        >
                          <th scope="row">
                            <div className="media align-items-center">
                              <div className="media-body">
                                <span className="name mb-0 text-sm">
                                  {local.nombre}
                                </span>
                              </div>
                            </div>
                          </th>
                          <td>
                            <Badge color={getTipoColor(local.tipo)}>
                              {local.tipo}
                            </Badge>
                          </td>
                          <td>
                            <span 
                              style={{ 
                                color: local.promedio <= 3 ? '#dc3545' : '#495057',
                                fontWeight: '600',
                                fontSize: '16px'
                              }}
                            >
                              {Math.round(local.promedio)}
                            </span>
                          </td>
                          <td>
                            <span className="h6 mb-0">{local.evaluaciones}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Segundo Formulario: Filtros por Tipo y Preguntas */}
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Análisis por Preguntas Específicas</h3>
              </CardHeader>
              <CardBody>
                {/* Filtros */}
                <Row className="mb-4 g-2">
                  <Col xs="12" sm="6" md="4" lg="4" xl="4">
                    <FormGroup className="mb-0">
                      <label 
                        className="form-control-label"
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#495057',
                          lineHeight: '1.2'
                        }}
                      >
                        Tipo de Local
                      </label>
                      <Input
                        type="select"
                        value={selectedTipo}
                        onChange={(e) => {
                          setSelectedTipo(e.target.value);
                          setSelectedPregunta("all");
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
                          transition: 'all 0.3s ease',
                          width: '100%',
                          marginTop: '0'
                        }}
                      >
                        <option value="all">Todos los tipos</option>
                        <option value="Alimentos">Alimentos</option>
                        <option value="Misceláneas">Misceláneas</option>
                        <option value="Taxis">Taxis</option>
                        <option value="Estacionamiento">Estacionamiento</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  
                  <Col xs="12" sm="6" md="4" lg="4" xl="4">
                    <FormGroup className="mb-0">
                      <label 
                        className="form-control-label"
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#495057',
                          lineHeight: '1.2'
                        }}
                      >
                        Pregunta Específica
                      </label>
                      <Input
                        type="select"
                        value={selectedPregunta}
                        onChange={(e) => setSelectedPregunta(e.target.value)}
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
                          transition: 'all 0.3s ease',
                          width: '100%',
                          marginTop: '0'
                        }}
                      >
                        <option value="all">❓ Seleccionar pregunta</option>
                        {getPreguntasDisponibles().map((pregunta, index) => (
                          <option key={index} value={pregunta}>
                            {pregunta}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  
                  <Col xs="12" sm="12" md="4" lg="4" xl="4">
                    <FormGroup className="mb-0">
                      <label 
                        className="form-control-label"
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#495057',
                          lineHeight: '1.2'
                        }}
                      >
                        &nbsp;
                      </label>
                      <div className="d-flex gap-2 align-items-end">
                        <Button
                          color="secondary"
                          onClick={() => {
                            setSelectedTipo("all");
                            setSelectedPregunta("all");
                          }}
                          style={{ 
                            width: '120px',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: '500',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FaFilter className="mr-1" />
                          Limpiar
                        </Button>
                        {selectedPregunta !== "all" && (
                          <Badge 
                            color="success" 
                            className="px-3 py-2 d-flex align-items-center"
                            style={{
                              height: '48px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {getRespuestasFiltradas().length} respuestas
                          </Badge>
                        )}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>

                {/* Resultados */}
                {selectedPregunta !== "all" && (
                  <div className="mt-4">
                    <h5>Resultados para: "{selectedPregunta}"</h5>
                    <div className="table-responsive">
                      <Table className="align-items-center table-flush">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">Local</th>
                            <th scope="col">Calificación</th>
                            <th scope="col">Comentario</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getRespuestasFiltradas().map((respuesta, index) => (
                            <tr key={index}>
                              <th scope="row">
                                <span className="name mb-0 text-sm">
                                  {respuesta.local}
                                </span>
                              </th>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="me-2">{getRatingStars(respuesta.calificacion)}</div>
                                  <span 
                                    style={{ 
                                      color: respuesta.calificacion <= 3 ? '#dc3545' : '#495057',
                                      fontWeight: '600'
                                    }}
                                  >
                                    {respuesta.calificacion}/5
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className="text-sm">{respuesta.comentario}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}

                {selectedPregunta === "all" && selectedTipo !== "all" && (
                  <div className="text-center py-5">
                    <h5 className="text-muted">Selecciona una pregunta específica</h5>
                    <p className="text-muted">
                      Elige una pregunta del tipo "{selectedTipo}" para ver las calificaciones detalladas.
                    </p>
                  </div>
                )}

                {selectedTipo === "all" && (
                  <div className="text-center py-5">
                    <h5 className="text-muted">Selecciona un tipo de local</h5>
                    <p className="text-muted">
                      Elige un tipo de local para ver las preguntas disponibles y sus calificaciones.
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

export default Estadisticas; 