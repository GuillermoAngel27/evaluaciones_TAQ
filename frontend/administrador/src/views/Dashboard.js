import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Badge,
  Progress,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert,
  Spinner,
} from "reactstrap";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";
import classnames from "classnames";

// API
import { evaluacionesAPI } from "utils/api.js";



// Iconos
import {
  FaStore,
  FaStar,
  FaUsers,
  FaChartLine,
  FaCalendarAlt,
  FaDownload,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaTrophy,
  FaClock,
  FaComments,
  FaUtensils,
  FaShoppingBag,
  FaCar,
  FaParking,
} from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [timeRange, setTimeRange] = useState("7d");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Estilos CSS personalizados para mejorar la presentación
  const customStyles = `
    .local-name-hover {
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
      transition: all 0.3s ease;
    }
    
    .local-name-hover:nth-child(odd) {
      background-color: #f8f9fa;
    }
    
    .local-name-hover:nth-child(even) {
      background-color: #ffffff;
    }
    
    .local-name-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      background-color: #e3f2fd !important;
    }
    
    .local-name-hover:hover .local-name {
      color: #1976d2 !important;
    }
  `;

  // Estados para datos dinámicos
  const [statsData, setStatsData] = useState({
    totalLocales: 0,
    totalEvaluaciones: 0,
    promedioCalificacion: 0,
    evaluacionesHoy: 0,
    localesActivos: 0,
    localesInactivos: 0,
  });
  const [topLocalesData, setTopLocalesData] = useState([]);
  const [ultimasEvaluacionesData, setUltimasEvaluacionesData] = useState([]);
  const [comentariosRecientesData, setComentariosRecientesData] = useState([]);
  const [calificacionesBarrasData, setCalificacionesBarrasData] = useState(null);
  const [evaluacionesPorDia, setEvaluacionesPorDia] = useState(null);
  
  // Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar todos los datos del dashboard
  const cargarDatosDashboard = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      // Cargar datos en paralelo
      const [
        statsResponse,
        topLocalesResponse,
        ultimasEvaluacionesResponse,
        comentariosResponse,
        calificacionesResponse,
        evaluacionesDiaResponse
      ] = await Promise.all([
        evaluacionesAPI.getDashboardStats(),
        evaluacionesAPI.getTopLocales(5),
        evaluacionesAPI.getUltimasEvaluaciones(6),
        evaluacionesAPI.getComentariosRecientes(6),
        evaluacionesAPI.getCalificacionesPorTipo(),
        evaluacionesAPI.getEvaluacionesPorDia(7)
      ]);

      setStatsData(statsResponse.data);
      setTopLocalesData(topLocalesResponse.data);
      setUltimasEvaluacionesData(ultimasEvaluacionesResponse.data);
      setComentariosRecientesData(comentariosResponse.data);
      setCalificacionesBarrasData(calificacionesResponse.data);
      setEvaluacionesPorDia(evaluacionesDiaResponse.data);
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      setError('Error al cargar los datos del dashboard. Por favor, intente nuevamente.');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };







  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatosDashboard(true); // Mostrar loading inicial
    
    // Configurar actualización automática cada 30 segundos (silenciosa)
    const intervalId = setInterval(() => {
      cargarDatosDashboard(false); // No mostrar loading en actualizaciones automáticas
    }, 30000); // 30 segundos
    
    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  // Datos de ejemplo para estadísticas (fallback)
  const statsDataFallback = {
    totalLocales: 24,
    totalEvaluaciones: 156,
    promedioCalificacion: 4.2,
    evaluacionesHoy: 18,
    localesActivos: 22,
    localesInactivos: 2,
  };





  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Opciones adicionales para gráficos de Estadísticas
  const chartOptionsExtended = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        beginAtZero: true,
        max: 5,
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  // Opciones para gráfica de barras de calificaciones
  const calificacionesBarrasOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Promedio: ${Math.round(context.parsed.y)}/5`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
        ticks: {
          callback: function(value) {
            return Math.round(value);
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        }
      },
    },
  };

  // Componente de tarjeta de estadística
  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <Card className="card-stats mb-4 mb-xl-0">
      <CardBody>
        <Row>
          <div className="col">
            <h5 className="card-title text-uppercase text-muted mb-0">
              {title}
            </h5>
            <span className="h2 font-weight-bold mb-0">{value}</span>
            {subtitle && (
              <p className="mt-3 mb-0 text-muted text-sm">
                <span className={trend === "up" ? "text-success mr-2" : "text-danger mr-2"}>
                  <i className={trend === "up" ? "fas fa-arrow-up" : "fas fa-arrow-down"}></i>
                  {subtitle}
                </span>
                <span className="text-nowrap">Desde el mes pasado</span>
              </p>
            )}
          </div>
          <Col className="col-auto">
            <div className="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
              {icon}
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );

  return (
    <>
      <style>{customStyles}</style>
      <div className="header pb-8 pt-5 pt-md-8" style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}>
        <Container fluid>
          <div className="header-body">


            {/* Alert de error */}
            {error && (
              <Alert color="danger" className="mb-3">
                {error}
                <Button 
                  color="link" 
                  className="p-0 ml-2"
                  onClick={() => cargarDatosDashboard(true)}
                >
                  Reintentar
                </Button>
              </Alert>
            )}



            <Row>
              <Col lg="6" xl="3">
                <StatCard
                  title="Total Locales"
                  value={loading ? '...' : (statsData.totalLocales || statsDataFallback.totalLocales)}
                  icon={<FaStore />}
                  color="bg-gradient-red"
                  subtitle={loading ? '' : "+12%"}
                  trend="up"
                />
              </Col>
              <Col lg="6" xl="3">
                <StatCard
                  title="Evaluaciones Hoy"
                  value={loading ? '...' : (statsData.evaluacionesHoy || statsDataFallback.evaluacionesHoy)}
                  icon={<FaStar />}
                  color="bg-gradient-orange"
                  subtitle={loading ? '' : "+8%"}
                  trend="up"
                />
              </Col>
              <Col lg="6" xl="3">
                <StatCard
                  title="Promedio Calificación"
                  value={loading ? '...' : Math.round(parseFloat(statsData.promedioCalificacion) || parseFloat(statsDataFallback.promedioCalificacion) || 0)}
                  icon={<FaChartLine />}
                  color="bg-gradient-green"
                  subtitle={loading ? '' : "+0.3"}
                  trend="up"
                />
              </Col>
              <Col lg="6" xl="3">
                <StatCard
                  title="Total Evaluaciones"
                  value={loading ? '...' : (statsData.totalEvaluaciones || statsDataFallback.totalEvaluaciones)}
                  icon={<FaUsers />}
                  color="bg-gradient-info"
                  subtitle={loading ? '' : "+15%"}
                  trend="up"
                />
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <Container className="mt--7" fluid>
        {/* Eliminado: Evaluaciones por Día, Distribución de Calificaciones, Tipos de Locales */}

        {/* Tendencias mensuales */}
        {/* Eliminado: Tendencias Mensuales */}

        {/* Métricas de rendimiento */}
        {/* Eliminado: Rendimiento por Categoría, Análisis de Satisfacción */}

        {/* Gráfica principal - Calificaciones por Tipo de Local */}
        <Row className="mt-4">
          <Col lg="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">
                      <FaChartLine className="mr-2 text-primary" />
                      Calificaciones por Tipo de Local
                    </h3>
                  </div>
                  <div className="col text-right">
                    <Badge color="primary">Promedio por Categoría</Badge>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {loading && !calificacionesBarrasData ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                    <p className="mt-2">Cargando datos de la gráfica...</p>
                  </div>
                ) : calificacionesBarrasData ? (
                  <>
                    <div className="chart" style={{ height: "400px" }}>
                      <Bar data={calificacionesBarrasData} options={calificacionesBarrasOptions} />
                    </div>
                    <div className="mt-3">
                      <Row>
                        <Col md="6">
                          <div className="text-center">
                            <h6 className="text-muted">Promedio General</h6>
                            <h4 className="text-primary">
                              {Math.round(parseFloat(statsData.promedioCalificacion) || 0)}/5
                            </h4>
                          </div>
                        </Col>
                        <Col md="6">
                          <div className="text-center">
                            <h6 className="text-muted">Total Evaluaciones</h6>
                            <h4 className="text-success">{statsData.totalEvaluaciones || 0}</h4>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col md="12">
                          <div className="text-center">
                            <small className="text-muted">
                              <strong>Última actualización:</strong> {new Date().toLocaleString('es-ES')}
                            </small>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted">No hay datos disponibles para mostrar la gráfica.</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">
                      <FaComments className="mr-2 text-success" />
                      Comentarios Recientes
                    </h3>
                  </div>
                  <div className="col text-right">
                    <Badge color="success">Nuevos</Badge>
                  </div>
                </Row>
              </CardHeader>
              <CardBody style={{ height: '500px', overflowY: 'auto' }}>
                {loading && !comentariosRecientesData ? (
                  <div className="text-center py-5">
                    <Spinner color="success" />
                    <p className="mt-2">Cargando comentarios...</p>
                  </div>
                ) : comentariosRecientesData && comentariosRecientesData.length > 0 ? (
                  comentariosRecientesData.map((comentario) => (
                    <div key={comentario.id} className="local-name-hover">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="mb-0 font-weight-bold text-dark local-name" style={{ 
                            fontSize: '1.15rem', 
                            lineHeight: '1.3',
                            color: '#2d3748',
                            textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}>{comentario.local}</h5>
                          <small className="text-muted">por {comentario.usuario}</small>
                        </div>
                        <div className="text-right">
                          <Badge 
                            color={comentario.calificacion >= 4 ? "success" : comentario.calificacion >= 3 ? "warning" : "danger"}
                            className="mb-1"
                          >
                            {comentario.calificacion}/5
                          </Badge>
                          <br />
                          <small className="text-muted">{comentario.fecha}</small>
                        </div>
                      </div>
                      <p className="text-sm mb-0 mt-2" style={{ lineHeight: '1.4' }}>
                        "{comentario.comentario}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted">No hay comentarios recientes disponibles.</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Información de actividad reciente */}
        <Row className="mt-4">
          {/* Top 5 locales más evaluados */}
          <Col lg="6">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">
                      <FaTrophy className="mr-2 text-warning" />
                      Top 5 Locales
                    </h3>
                  </div>
                  <div className="col text-right">
                    <Badge color="warning">Más Evaluados</Badge>
                  </div>
                </Row>
              </CardHeader>
              <CardBody style={{ height: '400px', overflowY: 'auto' }}>
                {loading && !topLocalesData ? (
                  <div className="text-center py-5">
                    <Spinner color="warning" />
                    <p className="mt-2">Cargando top locales...</p>
                  </div>
                ) : topLocalesData && topLocalesData.length > 0 ? (
                  topLocalesData.map((local, index) => (
                    <div key={local.id} className="d-flex align-items-center local-name-hover">
                      <div className="mr-3">
                        <Badge 
                          color={index === 0 ? "warning" : index === 1 ? "secondary" : index === 2 ? "danger" : "info"}
                          className="rounded-circle"
                          style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {local.posicion}
                        </Badge>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h5 className="mb-0 font-weight-bold text-dark local-name" style={{ 
                            fontSize: '1.15rem', 
                            lineHeight: '1.3',
                            color: '#2d3748',
                            textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}>{local.nombre}</h5>
                          <Badge color="success" className="ml-2">
                            {local.promedio}
                          </Badge>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {local.tipo === "Alimentos" && <FaUtensils className="mr-1" />}
                            {local.tipo === "Misceláneas" && <FaShoppingBag className="mr-1" />}
                            {local.tipo === "Taxis" && <FaCar className="mr-1" />}
                            {local.tipo === "Estacionamiento" && <FaParking className="mr-1" />}
                            {local.tipo}
                          </small>
                          <small className="text-muted">{local.evaluaciones} eval.</small>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted">No hay datos de top locales disponibles.</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>

          {/* Últimas 6 evaluaciones */}
          <Col lg="6">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">
                      <FaClock className="mr-2 text-info" />
                      Últimas 6 Evaluaciones
                    </h3>
                  </div>
                  <div className="col text-right">
                    <Badge color="info">Recientes</Badge>
                  </div>
                </Row>
              </CardHeader>
              <CardBody style={{ height: '400px', overflowY: 'auto' }}>
                {loading && !ultimasEvaluacionesData ? (
                  <div className="text-center py-5">
                    <Spinner color="info" />
                    <p className="mt-2">Cargando últimas evaluaciones...</p>
                  </div>
                ) : ultimasEvaluacionesData && ultimasEvaluacionesData.length > 0 ? (
                  ultimasEvaluacionesData.map((evaluacion) => (
                    <div key={evaluacion.id} className="local-name-hover">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div className="flex-grow-1">
                          <h5 className="mb-1 font-weight-bold text-dark local-name" style={{ 
                            fontSize: '1.15rem', 
                            lineHeight: '1.3',
                            color: '#2d3748',
                            textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}>{evaluacion.local}</h5>
                          <small className="text-muted">
                            {evaluacion.tipo === "alimentos" && <FaUtensils className="mr-1" />}
                            {evaluacion.tipo === "miscelaneas" && <FaShoppingBag className="mr-1" />}
                            {evaluacion.tipo === "taxis" && <FaCar className="mr-1" />}
                            {evaluacion.tipo === "estacionamiento" && <FaParking className="mr-1" />}
                            {evaluacion.tipo} • {evaluacion.fecha}
                          </small>
                        </div>
                        <div className="ml-2">
                          <Badge 
                            color={evaluacion.calificacion >= 4 ? "success" : evaluacion.calificacion >= 3 ? "warning" : "danger"}
                          >
                            {evaluacion.calificacion}/5
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted">No hay evaluaciones recientes disponibles.</p>
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

export default Dashboard; 