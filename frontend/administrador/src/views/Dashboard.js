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
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Resumen
                    </h6>
                    <h2 className="text-white mb-0">Evaluaciones por Día</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeTab === "1",
                          })}
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("1");
                          }}
                        >
                          <span className="d-none d-md-block">Semana</span>
                          <span className="d-md-none">S</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeTab === "2",
                          })}
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("2");
                          }}
                        >
                          <span className="d-none d-md-block">Mes</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Line data={evaluacionesChartData} options={chartOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Distribución
                    </h6>
                    <h2 className="mb-0">Calificaciones</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Doughnut data={calificacionesChartData} options={doughnutOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Tipos de Locales</h3>
                  </div>
                  <div className="col text-right">
                    <Dropdown
                      isOpen={dropdownOpen}
                      toggle={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <DropdownToggle caret color="primary" size="sm">
                        <FaFilter className="mr-1" />
                        Filtros
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Ver todos</DropdownItem>
                        <DropdownItem>Exportar datos</DropdownItem>
                        <DropdownItem>Configurar</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "300px" }}>
                  <Bar data={tiposLocalesData} options={chartOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Estado de Locales</h3>
                  </div>
                  <div className="col text-right">
                    <Button color="primary" size="sm">
                      <FaDownload className="mr-1" />
                      Exportar
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-sm font-weight-bold">Activos</span>
                    <span className="text-sm text-muted">
                      {statsData.localesActivos} locales
                    </span>
                  </div>
                  <Progress
                    value={(statsData.localesActivos / statsData.totalLocales) * 100}
                    color="success"
                    className="mb-3"
                  />
                </div>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-sm font-weight-bold">Inactivos</span>
                    <span className="text-sm text-muted">
                      {statsData.localesInactivos} locales
                    </span>
                  </div>
                  <Progress
                    value={(statsData.localesInactivos / statsData.totalLocales) * 100}
                    color="warning"
                    className="mb-3"
                  />
                </div>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-sm font-weight-bold">Mantenimiento</span>
                    <span className="text-sm text-muted">0 locales</span>
                  </div>
                  <Progress value={0} color="danger" className="mb-3" />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Contenido adicional de Estadísticas */}
        <Row className="mt-5">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Análisis Detallado de Estadísticas</h3>
              </CardHeader>
            </Card>
          </Col>
        </Row>

        {/* Gráficos principales de Estadísticas */}
        <Row className="mt-4">
          <Col lg="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Evaluaciones por Día</h3>
                  </div>
                  <div className="col text-right">
                    <Button color="primary" size="sm">
                      <FaDownload className="mr-1" />
                      Exportar
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "400px" }}>
                  <Line data={evaluacionesPorDia} options={chartOptionsExtended} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Distribución de Calificaciones</h3>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "400px" }}>
                  <Doughnut data={distribucionCalificaciones} options={doughnutOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Gráficos secundarios de Estadísticas */}
        <Row className="mt-4">
          <Col lg="6">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Calificaciones por Local</h3>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "300px" }}>
                  <Bar data={calificacionesPorLocal} options={barChartOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Tipos de Locales</h3>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "300px" }}>
                  <Pie data={tiposLocales} options={doughnutOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Tendencias mensuales */}
        <Row className="mt-4">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Tendencias Mensuales</h3>
                  </div>
                  <div className="col text-right">
                    <Badge color="success" className="mr-2">
                      <FaArrowUp className="mr-1" />
                      +12% vs mes anterior
                    </Badge>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart" style={{ height: "400px" }}>
                  <Line data={tendenciasMensuales} options={chartOptionsExtended} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Métricas de rendimiento */}
        <Row className="mt-4">
          <Col lg="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Rendimiento por Categoría</h3>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-sm font-weight-bold">Restaurantes</span>
                    <span className="text-sm text-muted">4.3/5</span>
                  </div>
                  <Progress value={86} color="success" className="mb-2" />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-sm font-weight-bold">Cafés</span>
                    <span className="text-sm text-muted">4.1/5</span>
                  </div>
                  <Progress value={82} color="info" className="mb-2" />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-sm font-weight-bold">Bares</span>
                    <span className="text-sm text-muted">3.9/5</span>
                  </div>
                  <Progress value={78} color="warning" className="mb-2" />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-sm font-weight-bold">Pizzerías</span>
                    <span className="text-sm text-muted">3.7/5</span>
                  </div>
                  <Progress value={74} color="danger" className="mb-2" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Análisis de Satisfacción</h3>
              </CardHeader>
              <CardBody>
                <div className="text-center mb-4">
                  <div className="h1 text-primary">{statsDataExtended.satisfaccionGeneral}%</div>
                  <div className="text-muted">Satisfacción General</div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-sm">Muy Satisfecho</span>
                    <span className="text-sm text-muted">44%</span>
                  </div>
                  <Progress value={44} color="success" className="mb-2" />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-sm">Satisfecho</span>
                    <span className="text-sm text-muted">40%</span>
                  </div>
                  <Progress value={40} color="info" className="mb-2" />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-sm">Neutral</span>
                    <span className="text-sm text-muted">12%</span>
                  </div>
                  <Progress value={12} color="warning" className="mb-2" />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-sm">Insatisfecho</span>
                    <span className="text-sm text-muted">4%</span>
                  </div>
                  <Progress value={4} color="danger" className="mb-2" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Alertas y Recomendaciones</h3>
              </CardHeader>
              <CardBody>
                <Alert color="warning" className="mb-3">
                  <strong>Pizzería Italia</strong> - Calificación baja (3.8/5)
                  <br />
                  <small>Recomendación: Revisar servicio y calidad</small>
                </Alert>
                <Alert color="info" className="mb-3">
                  <strong>Café Central</strong> - Aumento en evaluaciones
                  <br />
                  <small>+25% más evaluaciones este mes</small>
                </Alert>
                <Alert color="success" className="mb-3">
                  <strong>Restaurante El Buen Sabor</strong> - Excelente rendimiento
                  <br />
                  <small>Mantener estándares de calidad</small>
                </Alert>
                <Alert color="danger" className="mb-3">
                  <strong>Bar La Esquina</strong> - Necesita atención
                  <br />
                  <small>Calificaciones en descenso</small>
                </Alert>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard; 