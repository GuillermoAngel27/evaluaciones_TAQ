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

  // Datos de ejemplo para estadísticas
  const statsData = {
    totalLocales: 24,
    totalEvaluaciones: 156,
    promedioCalificacion: 4.2,
    evaluacionesHoy: 18,
    localesActivos: 22,
    localesInactivos: 2,
  };

  // Datos para el top 5 de locales más evaluados
  const topLocalesData = [
    {
      id: 1,
      nombre: "Restaurante El Buen Sabor",
      tipo: "Alimentos",
      evaluaciones: 89,
      promedio: 4.8,
      posicion: 1
    },
    {
      id: 2,
      nombre: "Taxi Seguro",
      tipo: "Taxis",
      evaluaciones: 67,
      promedio: 4.7,
      posicion: 2
    },
    {
      id: 3,
      nombre: "Café Central",
      tipo: "Alimentos",
      evaluaciones: 45,
      promedio: 4.2,
      posicion: 3
    },
    {
      id: 4,
      nombre: "Miscelánea 24/7",
      tipo: "Misceláneas",
      evaluaciones: 41,
      promedio: 4.1,
      posicion: 4
    },
    {
      id: 5,
      nombre: "Estacionamiento Centro",
      tipo: "Estacionamiento",
      evaluaciones: 23,
      promedio: 2.7,
      posicion: 5
    }
  ];

  // Datos para las últimas 6 evaluaciones
  const ultimasEvaluacionesData = [
    {
      id: 1,
      local: "Restaurante El Buen Sabor",
      tipo: "Alimentos",
      calificacion: 5,
      fecha: "2024-01-15 14:30",
      comentario: "Excelente comida y servicio"
    },
    {
      id: 2,
      local: "Taxi Seguro",
      tipo: "Taxis",
      calificacion: 4,
      fecha: "2024-01-15 13:45",
      comentario: "Conductor muy amable"
    },
    {
      id: 3,
      local: "Café Central",
      tipo: "Alimentos",
      calificacion: 3,
      fecha: "2024-01-15 12:20",
      comentario: "Café un poco frío"
    },
    {
      id: 4,
      local: "Miscelánea 24/7",
      tipo: "Misceláneas",
      calificacion: 5,
      fecha: "2024-01-15 11:15",
      comentario: "Muy buena atención"
    },
    {
      id: 5,
      local: "Estacionamiento Centro",
      tipo: "Estacionamiento",
      calificacion: 2,
      fecha: "2024-01-15 10:30",
      comentario: "Precios muy altos"
    },
    {
      id: 6,
      local: "Pizzería Italia",
      tipo: "Alimentos",
      calificacion: 4,
      fecha: "2024-01-15 09:45",
      comentario: "Pizza deliciosa"
    }
  ];

  // Datos para comentarios recientes
  const comentariosRecientesData = [
    {
      id: 1,
      local: "Restaurante El Buen Sabor",
      usuario: "María G.",
      calificacion: 5,
      fecha: "Hace 2 horas",
      comentario: "La mejor experiencia gastronómica que he tenido. El servicio es excepcional y la comida está deliciosa. Definitivamente volveré."
    },
    {
      id: 2,
      local: "Taxi Seguro",
      usuario: "Carlos M.",
      calificacion: 4,
      fecha: "Hace 3 horas",
      comentario: "Conductor muy profesional y puntual. El vehículo estaba impecable. Recomendado."
    },
    {
      id: 3,
      local: "Café Central",
      usuario: "Ana L.",
      calificacion: 3,
      fecha: "Hace 4 horas",
      comentario: "El café estaba un poco frío cuando me lo sirvieron, pero el ambiente es agradable."
    },
    {
      id: 4,
      local: "Miscelánea 24/7",
      usuario: "Roberto P.",
      calificacion: 5,
      fecha: "Hace 5 horas",
      comentario: "Excelente variedad de productos y precios justos. El personal es muy atento."
    },
    {
      id: 5,
      local: "Estacionamiento Centro",
      usuario: "Laura S.",
      calificacion: 2,
      fecha: "Hace 6 horas",
      comentario: "Los precios son muy altos para el servicio que ofrecen. No hay suficiente seguridad."
    },
    {
      id: 6,
      local: "Pizzería Italia",
      usuario: "Diego R.",
      calificacion: 4,
      fecha: "Hace 7 horas",
      comentario: "Pizza auténtica italiana. Muy buena calidad de ingredientes y sabor."
    }
  ];

  // Datos para gráfico de evaluaciones por día
  const evaluacionesChartData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Evaluaciones",
        data: [12, 19, 15, 25, 22, 30, 28],
        fill: true,
        backgroundColor: "rgba(94, 114, 228, 0.1)",
        borderColor: "rgba(94, 114, 228, 1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Datos para gráfico de calificaciones
  const calificacionesChartData = {
    labels: ["1★", "2★", "3★", "4★", "5★"],
    datasets: [
      {
        data: [5, 12, 25, 45, 69],
        backgroundColor: [
          "#f5365c",
          "#fb6340",
          "#fbb040",
          "#11cdef",
          "#2dce89",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Datos para gráfico de tipos de locales
  const tiposLocalesData = {
    labels: ["Restaurante", "Café", "Bar", "Pizzería", "Otros"],
    datasets: [
      {
        label: "Cantidad",
        data: [8, 6, 4, 3, 3],
        backgroundColor: [
          "#5e72e4",
          "#f5365c",
          "#fb6340",
          "#fbb040",
          "#11cdef",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Datos para gráfica de barras de calificaciones con promedio
  const calificacionesBarrasData = {
    labels: ["Alimentos", "Misceláneas", "Taxis", "Estacionamiento"],
    datasets: [
      {
        label: "Promedio de Calificación",
        data: [4.3, 4.1, 4.6, 2.7],
        backgroundColor: [
          "#2dce89", // Verde para Alimentos
          "#11cdef", // Azul para Misceláneas
          "#fbb040", // Amarillo para Taxis
          "#f5365c", // Rojo para Estacionamiento
        ],
        borderColor: [
          "#2dce89",
          "#11cdef",
          "#fbb040",
          "#f5365c",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Número de Evaluaciones",
        data: [156, 69, 89, 23],
        backgroundColor: [
          "rgba(45, 206, 137, 0.3)",
          "rgba(17, 205, 239, 0.3)",
          "rgba(251, 176, 64, 0.3)",
          "rgba(245, 54, 92, 0.3)",
        ],
        borderColor: [
          "#2dce89",
          "#11cdef",
          "#fbb040",
          "#f5365c",
        ],
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        type: 'line',
        fill: false,
        tension: 0.4,
      }
    ],
  };

  // Datos adicionales de Estadísticas
  const statsDataExtended = {
    totalLocales: 24,
    totalEvaluaciones: 156,
    promedioGeneral: 4.2,
    evaluacionesHoy: 18,
    evaluacionesSemana: 89,
    evaluacionesMes: 342,
    localesActivos: 22,
    localesInactivos: 2,
    satisfaccionGeneral: 84,
  };

  // Datos para gráfico de evaluaciones por día (Estadísticas)
  const evaluacionesPorDia = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Evaluaciones",
        data: [12, 19, 15, 25, 22, 30, 28],
        fill: true,
        backgroundColor: "rgba(94, 114, 228, 0.1)",
        borderColor: "rgba(94, 114, 228, 1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // Datos para gráfico de calificaciones por local
  const calificacionesPorLocal = {
    labels: ["Restaurante El Buen Sabor", "Café Central", "Pizzería Italia", "Bar La Esquina"],
    datasets: [
      {
        label: "Calificación Promedio",
        data: [4.2, 4.5, 3.8, 4.0],
        backgroundColor: [
          "rgba(94, 114, 228, 0.8)",
          "rgba(45, 206, 137, 0.8)",
          "rgba(251, 99, 64, 0.8)",
          "rgba(17, 205, 239, 0.8)",
        ],
        borderColor: [
          "rgba(94, 114, 228, 1)",
          "rgba(45, 206, 137, 1)",
          "rgba(251, 99, 64, 1)",
          "rgba(17, 205, 239, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Datos para gráfico de distribución de calificaciones
  const distribucionCalificaciones = {
    labels: ["1★", "2★", "3★", "4★", "5★"],
    datasets: [
      {
        data: [5, 12, 25, 45, 69],
        backgroundColor: [
          "#f5365c",
          "#fb6340",
          "#fbb040",
          "#11cdef",
          "#2dce89",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Datos para gráfico de tipos de locales (Estadísticas)
  const tiposLocales = {
    labels: ["Restaurante", "Café", "Bar", "Pizzería", "Otros"],
    datasets: [
      {
        data: [8, 6, 4, 3, 3],
        backgroundColor: [
          "#5e72e4",
          "#f5365c",
          "#fb6340",
          "#fbb040",
          "#11cdef",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Datos para gráfico de tendencias mensuales
  const tendenciasMensuales = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Evaluaciones",
        data: [45, 52, 48, 61, 55, 67],
        borderColor: "rgba(94, 114, 228, 1)",
        backgroundColor: "rgba(94, 114, 228, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Promedio Calificación",
        data: [3.8, 4.0, 4.1, 4.2, 4.3, 4.2],
        borderColor: "rgba(45, 206, 137, 1)",
        backgroundColor: "rgba(45, 206, 137, 0.1)",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
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
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataset.label === "Promedio de Calificación") {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}/5`;
            } else {
              return `${context.dataset.label}: ${context.parsed.y}`;
            }
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
            return value.toFixed(1);
          }
        }
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return value;
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
              <div className="header pb-8 pt-5 pt-md-8" style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}>
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col lg="6" xl="3">
                <StatCard
                  title="Total Locales"
                  value={statsData.totalLocales}
                  icon={<FaStore />}
                  color="bg-gradient-red"
                  subtitle="+12%"
                  trend="up"
                />
              </Col>
              <Col lg="6" xl="3">
                <StatCard
                  title="Evaluaciones Hoy"
                  value={statsData.evaluacionesHoy}
                  icon={<FaStar />}
                  color="bg-gradient-orange"
                  subtitle="+8%"
                  trend="up"
                />
              </Col>
              <Col lg="6" xl="3">
                <StatCard
                  title="Promedio Calificación"
                  value={statsData.promedioCalificacion}
                  icon={<FaChartLine />}
                  color="bg-gradient-green"
                  subtitle="+0.3"
                  trend="up"
                />
              </Col>
              <Col lg="6" xl="3">
                <StatCard
                  title="Total Evaluaciones"
                  value={statsData.totalEvaluaciones}
                  icon={<FaUsers />}
                  color="bg-gradient-info"
                  subtitle="+15%"
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
                <div className="chart" style={{ height: "400px" }}>
                  <Bar data={calificacionesBarrasData} options={calificacionesBarrasOptions} />
                </div>
                <div className="mt-3">
                  <Row>
                    <Col md="6">
                      <div className="text-center">
                        <h6 className="text-muted">Promedio General</h6>
                        <h4 className="text-primary">4.2/5</h4>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="text-center">
                        <h6 className="text-muted">Total Evaluaciones</h6>
                        <h4 className="text-success">337</h4>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md="12">
                      <div className="text-center">
                        <small className="text-muted">
                          <strong>Mejor categoría:</strong> Taxis (4.6/5) • 
                          <strong> Más evaluaciones:</strong> Alimentos (156)
                        </small>
                      </div>
                    </Col>
                  </Row>
                </div>
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
                {comentariosRecientesData.map((comentario) => (
                  <div key={comentario.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-0">{comentario.local}</h6>
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
                    <p className="text-sm mb-0" style={{ lineHeight: '1.4' }}>
                      "{comentario.comentario}"
                    </p>
                  </div>
                ))}
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
                {topLocalesData.map((local, index) => (
                  <div key={local.id} className="d-flex align-items-center mb-3">
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
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">{local.nombre}</h6>
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
                ))}
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
                      Últimas Evaluaciones
                    </h3>
                  </div>
                  <div className="col text-right">
                    <Badge color="info">Recientes</Badge>
                  </div>
                </Row>
              </CardHeader>
              <CardBody style={{ height: '400px', overflowY: 'auto' }}>
                {ultimasEvaluacionesData.map((evaluacion) => (
                  <div key={evaluacion.id} className="border-bottom pb-2 mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{evaluacion.local}</h6>
                        <p className="text-sm text-muted mb-1">{evaluacion.comentario}</p>
                        <small className="text-muted">
                          {evaluacion.tipo === "Alimentos" && <FaUtensils className="mr-1" />}
                          {evaluacion.tipo === "Misceláneas" && <FaShoppingBag className="mr-1" />}
                          {evaluacion.tipo === "Taxis" && <FaCar className="mr-1" />}
                          {evaluacion.tipo === "Estacionamiento" && <FaParking className="mr-1" />}
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
                ))}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard; 