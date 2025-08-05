import React, { useState, useEffect } from "react";
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
  Spinner,
  Alert,
  Pagination,
  PaginationItem,
  PaginationLink,
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
  FaBuilding,
  FaQuestionCircle,
  FaChartBar,
} from "react-icons/fa";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { localesAPI } from "utils/api.js";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Estilos CSS para los bordes de las filas
const styles = {
  borderLeftDanger: {
    borderLeft: '4px solid #dc3545'
  },
  borderLeftSuccess: {
    borderLeft: '4px solid #28a745'
  }
};

const Estadisticas = () => {
  // Estilos CSS personalizados para badges de tipo
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Estilos forzados para badges de tipo de local en estadísticas */
      .badge-tipo-alimentos {
        background-color: #F5D5E0 !important;
        color: #333333 !important;
        border: none !important;
        padding: 8px 12px !important;
        border-radius: 6px !important;
        font-size: 10px !important;
        font-weight: 500 !important;
      }
      .badge-tipo-miscelaneas {
        background-color: #6667AB !important;
        color: #ffffff !important;
        border: none !important;
        padding: 8px 12px !important;
        border-radius: 6px !important;
        font-size: 10px !important;
        font-weight: 500 !important;
      }
      .badge-tipo-taxis {
        background-color: #7B337E !important;
        color: #ffffff !important;
        border: none !important;
        padding: 8px 12px !important;
        border-radius: 6px !important;
        font-size: 10px !important;
        font-weight: 500 !important;
      }
      .badge-tipo-estacionamiento {
        background-color: #420D4B !important;
        color: #ffffff !important;
        border: none !important;
        padding: 8px 12px !important;
        border-radius: 6px !important;
        font-size: 10px !important;
        font-weight: 500 !important;
      }

      /* Estilos modernos para el contador de locales */
      .contador-locales {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        border: none !important;
        padding: 8px 18px !important;
        border-radius: 20px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        position: relative !important;
        overflow: hidden !important;
        min-width: 120px !important;
        text-align: center !important;
        letter-spacing: 0.5px !important;
        text-transform: uppercase !important;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
      }

      .contador-locales::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: -100% !important;
        width: 100% !important;
        height: 100% !important;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent) !important;
        transition: left 0.5s !important;
      }

      .contador-locales:hover {
        transform: translateY(-3px) scale(1.05) !important;
        box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4) !important;
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
      }

      .contador-locales:hover::before {
        left: 100% !important;
      }

      .contador-locales .numero {
        font-size: 18px !important;
        font-weight: 700 !important;
        margin-right: 8px !important;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
      }

      .contador-locales .texto {
        font-size: 12px !important;
        font-weight: 500 !important;
        opacity: 0.9 !important;
      }

      /* Animación de pulso para el contador */
      @keyframes pulse {
        0% {
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        50% {
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
        }
        100% {
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
      }

      .contador-locales {
        animation: pulse 2s infinite !important;
      }

      .contador-locales:hover {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Estados para el dashboard unificado
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("all");
  const [localesData, setLocalesData] = useState([]);
  const [loadingLocales, setLoadingLocales] = useState(true);
  const [errorLocales, setErrorLocales] = useState(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estados para insights
  const [insightsData, setInsightsData] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [errorInsights, setErrorInsights] = useState(null);



  // Estado para gráfica de preguntas
  const [selectedTipoGrafica, setSelectedTipoGrafica] = useState("alimentos");
  const [datosGrafica, setDatosGrafica] = useState(null);
  const [loadingGrafica, setLoadingGrafica] = useState(false);

  // Cargar datos de locales y insights al montar el componente
  useEffect(() => {
    cargarLocales();
    cargarInsights();
  }, []);

  // Cargar datos de la gráfica cuando cambie el tipo seleccionado
  useEffect(() => {
    cargarDatosGrafica(selectedTipoGrafica);
  }, [selectedTipoGrafica]);

  // Función para cargar locales con estadísticas
  const cargarLocales = async () => {
    try {
      setLoadingLocales(true);
      setErrorLocales(null);
      
      const response = await localesAPI.getEstadisticas();
      console.log('Datos de locales cargados:', response.data);
      setLocalesData(response.data);
    } catch (error) {
      console.error('Error cargando locales:', error);
      setErrorLocales('Error al cargar los datos de locales. Por favor, intente nuevamente.');
    } finally {
      setLoadingLocales(false);
    }
  };

  // Función para cargar insights de evaluación
  const cargarInsights = async () => {
    try {
      setLoadingInsights(true);
      setErrorInsights(null);
      
      const response = await localesAPI.getInsightsEvaluacion();
      console.log('Insights cargados:', response.data);
      setInsightsData(response.data);
    } catch (error) {
      console.error('Error cargando insights:', error);
      setErrorInsights('Error al cargar los insights. Por favor, intente nuevamente.');
    } finally {
      setLoadingInsights(false);
    }
  };

  // Función para cargar datos de la gráfica por pregunta
  const cargarDatosGrafica = async (tipoLocal) => {
    try {
      setLoadingGrafica(true);
      
      const response = await localesAPI.getPromediosPorPregunta(tipoLocal);
      console.log('Datos de gráfica cargados:', response.data);
      setDatosGrafica(response.data);
    } catch (error) {
      console.error('Error cargando datos de gráfica:', error);
      setDatosGrafica(null);
    } finally {
      setLoadingGrafica(false);
    }
  };

  // Configuración de preguntas por tipo de local (usando la configuración del backend)
  const preguntasPorTipo = {
    "alimentos": [
      "¿El personal fue amable?",
      "¿El local estaba limpio?",
      "¿La atención fue rápida?",
      "¿Al finalizar su compra le entregaron ticket?",
      "¿La relación calidad-precio fue adecuada?"
    ],
    "miscelaneas": [
      "¿El personal fue amable?",
      "¿El local estaba limpio?",
      "¿La atención fue rápida?",
      "¿Al finalizar su compra le entregaron ticket?"
    ],
    "taxis": [
      "¿El personal fue amable?",
      "¿Las instalaciones se encuentra limpias?",
      "¿La asignación de unidad fue rápida?",
      "¿Las instalaciones son adecuadas para realizar el abordaje?"
    ],
    "estacionamiento": [
      "¿El personal fue amable?",
      "¿Las instalaciones se encuentran limpias?",
      "¿El acceso a las instalaciones son adecuadas?",
      "¿El proceso para pago fue optimo?"
    ]
  };

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
      case "alimentos":
        return <FaUtensils size={20} />;
      case "miscelaneas":
        return <FaShoppingBag size={20} />;
      case "taxis":
        return <FaCar size={20} />;
      case "estacionamiento":
        return <FaParking size={20} />;
      default:
        return <FaStore size={20} />;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "alimentos":
        return "badge-tipo-alimentos";
      case "miscelaneas":
        return "badge-tipo-miscelaneas";
      case "taxis":
        return "badge-tipo-taxis";
      case "estacionamiento":
        return "badge-tipo-estacionamiento";
      default:
        return "badge-tipo-miscelaneas";
    }
  };

  const normalizarTipoLocal = (tipo) => {
    if (!tipo) return '';
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('alimento')) return 'alimentos';
    if (tipoLower.includes('miscelanea')) return 'miscelaneas';
    if (tipoLower.includes('taxi')) return 'taxis';
    if (tipoLower.includes('estacionamiento') || tipoLower.includes('parking')) return 'estacionamiento';
    return tipoLower;
  };

  // Filtrado para el primer formulario
  const filteredLocales = localesData.filter((local) => {
    const matchesSearch = local.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "all" || normalizarTipoLocal(local.tipo) === filterTipo;
    return matchesSearch && matchesTipo;
  });

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLocales = filteredLocales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocales.length / itemsPerPage);

  // Función para cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para cambiar items por página
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset a la primera página
  };

  // Función para limpiar filtros y paginación
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterTipo("all");
    setCurrentPage(1);
  };

  // Función para generar datos de la gráfica de preguntas
  const generarDatosGrafica = () => {
    if (!datosGrafica || datosGrafica.length === 0) {
      return null;
    }

    const labels = datosGrafica.map(item => item.pregunta);
    const data = datosGrafica.map(item => item.promedio);
    
    return {
      labels: labels,
      datasets: [
        {
          label: '',
          data: data,
          backgroundColor: data.map(promedio => {
            if (promedio === 5) return 'rgba(40, 167, 69, 0.8)'; // Verde para excelente (5⭐)
            if (promedio === 4) return 'rgba(255, 193, 7, 0.8)'; // Amarillo para regular (4⭐)
            return 'rgba(220, 53, 69, 0.8)'; // Rojo para necesita mejora (3-1⭐)
          }),
          borderColor: data.map(promedio => {
            if (promedio === 5) return 'rgba(40, 167, 69, 1)';
            if (promedio === 4) return 'rgba(255, 193, 7, 1)';
            return 'rgba(220, 53, 69, 1)';
          }),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    };
  };

  // Opciones de la gráfica
  const opcionesGrafica = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Promedio de ${selectedTipoGrafica.charAt(0).toUpperCase() + selectedTipoGrafica.slice(1)}: ${
          datosGrafica && datosGrafica.length > 0 
            ? Math.round(datosGrafica.reduce((sum, item) => sum + parseFloat(item.promedio), 0) / datosGrafica.length)
            : 0
        }⭐`,
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#495057',
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Promedio: ${context.parsed.y}⭐`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          font: {
            size: 12
          },
          color: '#495057'
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        },
        title: {
          display: true,
          text: 'Promedio (⭐)',
          font: {
            size: 14,
            weight: 'bold'
          },
          color: '#495057'
        }
      },
      x: {
        ticks: {
          font: {
            size: 11
          },
          color: '#495057',
          maxRotation: 45,
          minRotation: 0
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    }
  };

  return (
    <>
      <div className="header pb-8 pt-5 pt-md-8" style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}>
        <Container fluid>
          
        </Container>
      </div>

      <Container className="mt--8" fluid>
        {/* Formularios Independientes */}
        <Row>
                  {/* Formulario 1: Estadísticas por Local */}
                  <Col lg="12" className="mb-4">
            <Card className="shadow">
              <CardHeader className="border-0" style={{ background: 'linear-gradient(135deg, rgb(239, 232, 240) 0%, rgb(255, 235, 247) 100%)' }}>
                        <h3 className="mb-0">
                          📋 Estadísticas por Local
                        </h3>
              </CardHeader>
              <CardBody>
                        {loadingLocales && (
                          <div className="text-center py-4">
                            <Spinner color="primary" />
                            <p className="mt-2">Cargando datos de locales...</p>
                          </div>
                        )}

                        {errorLocales && (
                          <Alert color="danger" className="mb-3">
                            {errorLocales}
                            <Button 
                              color="link" 
                              className="p-0 ml-2"
                              onClick={cargarLocales}
                            >
                              Reintentar
                            </Button>
                          </Alert>
                        )}

                        {!loadingLocales && !errorLocales && (
                          <>
                {/* Filtros y búsqueda */}
                <Row className="mb-4 g-3">
                  {/* Buscar - Ancho completo en móviles, mitad en tablets */}
                  <Col xs="12" sm="12" md="6" lg="3" xl="2">
                    <FormGroup>
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
                  
                  {/* Tipo - Ancho completo en móviles, mitad en tablets */}
                  <Col xs="12" sm="12" md="6" lg="3" xl="2">
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
                            🏢 Tipos
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
                  
                  {/* Botón Limpiar - Ancho completo en móviles, mitad en tablets */}
                  <Col xs="12" sm="6" md="6" lg="3" xl="3">
                    <FormGroup>
                      <Button
                        color="secondary"
                        onClick={handleClearFilters}
                        className="w-100"
                        style={{ 
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '500',
                          background: '#f7fafc',
                          border: 'none',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          color: '#495057'
                        }}
                      >
                        <FaFilter className="mr-1" />
                        Limpiar
                      </Button>
                    </FormGroup>
                  </Col>
                  
                  {/* Información de resultados - Ancho completo en móviles, mitad en tablets */}
                  <Col xs="12" sm="6" md="6" lg="3" xl="3">
                    <FormGroup>
                      <div className="d-flex justify-content-center justify-content-sm-end">
                        <div className="contador-locales">
                          <span className="numero">{filteredLocales.length}</span>
                          <span className="texto">Locales</span>
                        </div>
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
                                    <th scope="col">Última Evaluación</th>
                      </tr>
                    </thead>
                    <tbody>
                       {currentLocales.length > 0 ? (
                         currentLocales.map((local) => (
                        <tr 
                          key={local.id}
                          style={{
                                          backgroundColor: local.calificacionPromedio <= 3 ? '#fff5f5' : 'transparent'
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
                                          <Badge className={getTipoColor(normalizarTipoLocal(local.tipo))}>
                                            {normalizarTipoLocal(local.tipo)}
                            </Badge>
                          </td>
                          <td>
                            <span 
                              style={{ 
                                              color: local.calificacionPromedio <= 3 ? '#dc3545' : '#495057',
                                fontWeight: '600',
                                fontSize: '16px'
                              }}
                            >
                                            {local.calificacionPromedio.toFixed(1)}
                            </span>
                          </td>
                          <td>
                                          <span className="h6 mb-0">{local.totalEvaluaciones}</span>
                                        </td>
                                        <td>
                                          <span className="text-sm">
                                            {local.ultimaEvaluacion ? 
                                              new Date(local.ultimaEvaluacion).toLocaleDateString('es-ES') : 
                                              'N/A'
                                            }
                                          </span>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="5" className="text-center py-4">
                                        <p className="text-muted mb-0">
                                          {localesData.length === 0 
                                            ? 'No hay locales con evaluaciones registradas.' 
                                            : 'No se encontraron locales que coincidan con los filtros.'
                                          }
                                        </p>
                          </td>
                        </tr>
                                  )}
                    </tbody>
                  </Table>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <Row className="mt-4">
                    <Col md="6">
                      <div className="d-flex align-items-center">
                        <small className="text-muted">
                          Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLocales.length)} de {filteredLocales.length} locales
                        </small>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="d-flex justify-content-end align-items-center">
                        {/* Controles de paginación */}
                        <nav aria-label="Paginación de estadísticas">
                          <ul className="pagination pagination-sm mb-0">
                            {/* Botón Anterior */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button
                                className="page-link border-0"
                                onClick={() => handlePageChange(currentPage - 1)}
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
                                  onClick={() => handlePageChange(page)}
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
                                onClick={() => handlePageChange(currentPage + 1)}
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
                          </>
                        )}
              </CardBody>
            </Card>
          </Col>

                  {/* Formulario 2: Análisis por Pregunta */}
                  <Col lg="12" className="mb-4">
            <Card className="shadow">
              <CardHeader className="border-0" style={{ background: 'linear-gradient(135deg, rgb(239, 232, 240) 0%, rgb(255, 235, 247) 100%)' }}>
                        <h3 className="mb-0">
                          ❓ Análisis por Pregunta
                        </h3>
              </CardHeader>
              <CardBody>
                        {loadingInsights && (
                          <div className="text-center py-4">
                            <Spinner color="primary" />
                            <p className="mt-2">Cargando insights...</p>
                          </div>
                        )}

                        {errorInsights && (
                          <Alert color="danger" className="mb-3">
                            {errorInsights}
                            <Button 
                              color="link" 
                              className="p-0 ml-2"
                              onClick={cargarInsights}
                            >
                              Reintentar
                            </Button>
                          </Alert>
                        )}

                        {!loadingInsights && !errorInsights && insightsData && (
                          <>
                            {/* Selector de Tipo de Local */}
                            <Row className="mb-4">
                              <Col>
                                <Row>
                                  <Col md="6">
                                    <FormGroup>
                                      <label className="form-control-label">
                                        <strong>Seleccionar Tipo de Local:</strong>
                      </label>
                      <Input
                        type="select"
                                        value={selectedTipoGrafica}
                                        onChange={(e) => setSelectedTipoGrafica(e.target.value)}
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
                                        <option value="alimentos">🍽️ Alimentos</option>
                                        <option value="miscelaneas">🛍️ Misceláneas</option>
                                        <option value="taxis">🚗 Taxis</option>
                                        <option value="estacionamiento">🅿️ Estacionamiento</option>
                      </Input>
                    </FormGroup>
                  </Col>
                                  <Col md="6" className="d-flex align-items-end">
                                    {/* Espacio reservado para futuras funcionalidades */}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            {/* Gráfica de Barras */}
                            <Row>
                              <Col>
                                <Card className="shadow">
                                  <CardBody>
                                    <div style={{ height: '500px', position: 'relative' }}>
                                      {loadingGrafica ? (
                                        <div className="text-center py-5">
                                          <Spinner color="primary" />
                                          <p className="mt-2">Cargando datos de la gráfica...</p>
                                        </div>
                                      ) : generarDatosGrafica() ? (
                                        <Bar 
                                          data={generarDatosGrafica()} 
                                          options={opcionesGrafica}
                                        />
                                      ) : (
                                        <div className="text-center py-5">
                                          <p className="text-muted">
                                            No hay datos disponibles para el tipo de local seleccionado.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </CardBody>
                                </Card>
                              </Col>
                            </Row>

                            {/* Leyenda de Colores */}
                            <Row className="mt-3">
                              <Col>
                                <div className="d-flex justify-content-center">
                                  <div className="d-flex align-items-center mr-4">
                                    <div 
                                      style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: 'rgba(40, 167, 69, 0.8)',
                                        borderRadius: '4px',
                                        marginRight: '8px'
                                      }}
                                    ></div>
                                    <small className="text-success font-weight-bold">Excelente (5⭐)</small>
                                  </div>
                                  <div className="d-flex align-items-center mr-4">
                                    <div 
                        style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: 'rgba(255, 193, 7, 0.8)',
                                        borderRadius: '4px',
                                        marginRight: '8px'
                                      }}
                                    ></div>
                                    <small className="text-warning font-weight-bold">Regular (4⭐)</small>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <div 
                        style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: 'rgba(220, 53, 69, 0.8)',
                                        borderRadius: '4px',
                                        marginRight: '8px'
                                      }}
                                    ></div>
                                    <small className="text-danger font-weight-bold">Necesita Mejora (3-1⭐)</small>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </>
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                  
                  {/* Formulario 3: Comparación por Tipo */}
                  <Col lg="12" className="mb-4">
                    <Card className="shadow">
                      <CardHeader className="border-0" style={{ background: 'linear-gradient(135deg, rgb(239, 232, 240) 0%, rgb(255, 235, 247) 100%)' }}>
                        <h3 className="mb-0">
                          📈 Comparación por Tipo de Local
                        </h3>
                      </CardHeader>
                      <CardBody>
                        {loadingInsights && (
                          <div className="text-center py-4">
                            <Spinner color="primary" />
                            <p className="mt-2">Cargando tendencias...</p>
                          </div>
                        )}

                        {errorInsights && (
                          <Alert color="danger" className="mb-3">
                            {errorInsights}
                        <Button
                              color="link" 
                              className="p-0 ml-2"
                              onClick={cargarInsights}
                            >
                              Reintentar
                        </Button>
                          </Alert>
                        )}

                        {!loadingInsights && !errorInsights && insightsData && (
                          <Row>
                            <Col>
                             
                    <div className="table-responsive">
                                <Table className="table-flush">
                        <thead className="thead-light">
                          <tr>
                                      <th>Tipo de Local</th>
                                      <th>Promedio</th>
                                      <th>Total Evaluaciones</th>
                                      <th>Rendimiento</th>
                          </tr>
                        </thead>
                        <tbody>
                                    {insightsData.tendencias.map((tendencia, index) => (
                            <tr key={index}>
                              <td>
                                <div className="d-flex align-items-center">
                                            <div className="mr-3">
                                              {getTipoIcon(tendencia.tipoLocal)}
                                            </div>
                                            <strong>{tendencia.tipoLocal}</strong>
                                </div>
                              </td>
                              <td>
                                          <span 
                                            className={`font-weight-bold ${
                                              parseFloat(tendencia.promedio) === 5 ? 'text-success' :
                                              parseFloat(tendencia.promedio) === 4 ? 'text-warning' : 'text-danger'
                                            }`}
                                          >
                                            {tendencia.promedio}⭐
                                          </span>
                                        </td>
                                        <td>{tendencia.totalEvaluaciones}</td>
                                        <td>
                                          <Badge 
                                            color={
                                              parseFloat(tendencia.promedio) === 5 ? 'success' :
                                              parseFloat(tendencia.promedio) === 4 ? 'warning' : 'danger'
                                            }
                                          >
                                            {parseFloat(tendencia.promedio) === 5 ? 'Excelente' :
                                             parseFloat(tendencia.promedio) === 4 ? 'Regular' : 'Necesita Mejora'}
                                          </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                            </Col>
                          </Row>
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