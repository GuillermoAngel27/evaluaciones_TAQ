import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Progress,
  Alert,
} from "reactstrap";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  FaDownload,
  FaCalendarAlt,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaFilter,
  FaFileExcel,
  FaFilePdf,
  FaPrint,
  FaStar,
  FaStore,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const Estadisticas = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedLocal, setSelectedLocal] = useState("all");
  const [chartType, setChartType] = useState("line");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Datos de ejemplo para estadísticas
  const statsData = {
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

  // Datos para gráfico de evaluaciones por día
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

  // Datos para gráfico de tipos de locales
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
                <span className="text-nowrap">vs período anterior</span>
              </p>
            )}
          </div>
          <Col className="col-auto">
            <div className={`icon icon-shape bg-gradient-${color} text-white rounded-circle shadow`}>
              {icon}
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );

  const handleExport = (format) => {
    console.log(`Exportando en formato ${format}`);
    // Aquí se implementaría la lógica de exportación
  };

  const getChartComponent = () => {
    switch (chartType) {
      case "line":
        return <Line data={evaluacionesPorDia} options={chartOptions} />;
      case "bar":
        return <Bar data={calificacionesPorLocal} options={barChartOptions} />;
      case "doughnut":
        return <Doughnut data={distribucionCalificaciones} options={doughnutOptions} />;
      case "pie":
        return <Pie data={tiposLocales} options={doughnutOptions} />;
      default:
        return <Line data={evaluacionesPorDia} options={chartOptions} />;
    }
  };

  return (
    <>
              <div className="header pb-8 pt-5 pt-md-8" style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}>
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col>
                <h6 className="h2 text-white d-inline-block mb-0">Estadísticas Avanzadas</h6>
                <nav aria-label="breadcrumb" className="d-none d-md-inline-block ml-md-4">
                  <ol className="breadcrumb breadcrumb-links breadcrumb-dark">
                    <li className="breadcrumb-item">
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <i className="fas fa-home" />
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        Estadísticas
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Análisis
                    </li>
                  </ol>
                </nav>
              </Col>
              <Col className="text-right">
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={() => setDropdownOpen(!dropdownOpen)}
                >
                  <DropdownToggle caret color="primary">
                    <FaDownload className="mr-1" />
                    Exportar
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => handleExport("excel")}>
                      <FaFileExcel className="mr-2" />
                      Excel
                    </DropdownItem>
                    <DropdownItem onClick={() => handleExport("pdf")}>
                      <FaFilePdf className="mr-2" />
                      PDF
                    </DropdownItem>
                    <DropdownItem onClick={() => handleExport("print")}>
                      <FaPrint className="mr-2" />
                      Imprimir
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <Container className="mt--7" fluid>
        {/* Tarjetas de estadísticas principales */}
        <Row className="mb-4">
          <Col lg="3">
            <StatCard
              title="Total Evaluaciones"
              value={statsData.totalEvaluaciones}
              icon={<FaStar />}
              color="red"
              subtitle="+15%"
              trend="up"
            />
          </Col>
          <Col lg="3">
            <StatCard
              title="Promedio General"
              value={statsData.promedioGeneral}
              icon={<FaChartLine />}
              color="orange"
              subtitle="+0.3"
              trend="up"
            />
          </Col>
          <Col lg="3">
            <StatCard
              title="Satisfacción"
              value={`${statsData.satisfaccionGeneral}%`}
                                 icon={<FaArrowUp />}
              color="green"
              subtitle="+5%"
              trend="up"
            />
          </Col>
          <Col lg="3">
            <StatCard
              title="Locales Activos"
              value={statsData.localesActivos}
              icon={<FaStore />}
              color="info"
              subtitle="+2"
              trend="up"
            />
          </Col>
        </Row>

        {/* Controles de filtros */}
        <Row className="mb-4">
          <Col md="3">
            <FormGroup>
              <Label for="timeRange">Período de Tiempo</Label>
              <Input
                type="select"
                id="timeRange"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
                <option value="1y">Último año</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label for="selectedLocal">Local Específico</Label>
              <Input
                type="select"
                id="selectedLocal"
                value={selectedLocal}
                onChange={(e) => setSelectedLocal(e.target.value)}
              >
                <option value="all">Todos los locales</option>
                <option value="1">Restaurante El Buen Sabor</option>
                <option value="2">Café Central</option>
                <option value="3">Pizzería Italia</option>
                <option value="4">Bar La Esquina</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label for="chartType">Tipo de Gráfico</Label>
              <Input
                type="select"
                id="chartType"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option value="line">Línea</option>
                <option value="bar">Barras</option>
                <option value="doughnut">Dona</option>
                <option value="pie">Circular</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>&nbsp;</Label>
              <Button color="secondary" block>
                <FaFilter className="mr-1" />
                Aplicar Filtros
              </Button>
            </FormGroup>
          </Col>
        </Row>

        {/* Gráficos principales */}
        <Row>
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
                  {getChartComponent()}
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

        {/* Gráficos secundarios */}
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
                  <Line data={tendenciasMensuales} options={chartOptions} />
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
                  <div className="h1 text-primary">{statsData.satisfaccionGeneral}%</div>
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

export default Estadisticas; 