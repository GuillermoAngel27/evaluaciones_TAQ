import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Table,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaQrcode,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaStore,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const Locales = () => {
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Datos de ejemplo
  const [locales, setLocales] = useState([
    {
      id: 1,
      nombre: "Restaurante El Buen Sabor",
      tipo: "Restaurante",
      direccion: "Av. Principal 123",
      telefono: "555-0123",
      email: "info@buensabor.com",
      estatus: "Activo",
      calificacion: 4.2,
      evaluaciones: 45,
      fechaCreacion: "2024-01-15",
    },
    {
      id: 2,
      nombre: "Café Central",
      tipo: "Café",
      direccion: "Calle Comercial 456",
      telefono: "555-0456",
      email: "contacto@cafecentral.com",
      estatus: "Activo",
      calificacion: 4.5,
      evaluaciones: 32,
      fechaCreacion: "2024-01-20",
    },
    {
      id: 3,
      nombre: "Pizzería Italia",
      tipo: "Pizzería",
      direccion: "Plaza Mayor 789",
      telefono: "555-0789",
      email: "pedidos@pizzeriaitalia.com",
      estatus: "Inactivo",
      calificacion: 3.8,
      evaluaciones: 28,
      fechaCreacion: "2024-02-01",
    },
    {
      id: 4,
      nombre: "Bar La Esquina",
      tipo: "Bar",
      direccion: "Esquina Norte 321",
      telefono: "555-0321",
      email: "reservas@laesquina.com",
      estatus: "Mantenimiento",
      calificacion: 4.0,
      evaluaciones: 15,
      fechaCreacion: "2024-02-10",
    },
  ]);

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "Restaurante",
    direccion: "",
    telefono: "",
    email: "",
    estatus: "Activo",
  });

  const tiposLocales = ["Restaurante", "Café", "Bar", "Pizzería", "Otros"];
  const estadosLocales = ["Activo", "Inactivo", "Mantenimiento"];

  // Funciones de manejo
  const toggleModal = () => setModal(!modal);

  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      nombre: "",
      tipo: "Restaurante",
      direccion: "",
      telefono: "",
      email: "",
      estatus: "Activo",
    });
    setSelectedLocal(null);
    toggleModal();
  };

  const handleEdit = (local) => {
    setModalMode("edit");
    setSelectedLocal(local);
    setFormData({
      nombre: local.nombre,
      tipo: local.tipo,
      direccion: local.direccion,
      telefono: local.telefono,
      email: local.email,
      estatus: local.estatus,
    });
    toggleModal();
  };

  const handleView = (local) => {
    setModalMode("view");
    setSelectedLocal(local);
    setFormData({
      nombre: local.nombre,
      tipo: local.tipo,
      direccion: local.direccion,
      telefono: local.telefono,
      email: local.email,
      estatus: local.estatus,
    });
    toggleModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este local?")) {
      setLocales(locales.filter((local) => local.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "create") {
      const newLocal = {
        id: Date.now(),
        ...formData,
        calificacion: 0,
        evaluaciones: 0,
        fechaCreacion: new Date().toISOString().split("T")[0],
      };
      setLocales([...locales, newLocal]);
    } else if (modalMode === "edit") {
      setLocales(
        locales.map((local) =>
          local.id === selectedLocal.id ? { ...local, ...formData } : local
        )
      );
    }
    toggleModal();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Filtrado y búsqueda
  const filteredLocales = locales.filter((local) => {
    const matchesSearch = local.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      local.direccion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || local.estatus === filterStatus;
    const matchesType = filterType === "all" || local.tipo === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLocales = filteredLocales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocales.length / itemsPerPage);

  const getStatusBadge = (status) => {
    const colors = {
      Activo: "success",
      Inactivo: "secondary",
      Mantenimiento: "warning",
    };
    return <Badge color={colors[status]}>{status}</Badge>;
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`fa fa-star ${
            i <= rating ? "text-warning" : "text-muted"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <>
              <div className="header pb-8 pt-5 pt-md-8" style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}>
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col>
                <h6 className="h2 text-white d-inline-block mb-0">Gestión de Locales</h6>
                <nav aria-label="breadcrumb" className="d-none d-md-inline-block ml-md-4">
                  <ol className="breadcrumb breadcrumb-links breadcrumb-dark">
                    <li className="breadcrumb-item">
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <i className="fas fa-home" />
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        Locales
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Gestión
                    </li>
                  </ol>
                </nav>
              </Col>
              <Col className="text-right">
                <Button color="primary" onClick={handleCreate}>
                  <FaPlus className="mr-1" />
                  Nuevo Local
                </Button>
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
                    <h3 className="mb-0">Lista de Locales</h3>
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
                {/* Filtros y búsqueda */}
                <Row className="mb-4">
                  <Col md="4">
                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Buscar por nombre o dirección..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control-alternative"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Input
                        type="select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="form-control-alternative"
                      >
                        <option value="all">Todos los estados</option>
                        {estadosLocales.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <Input
                        type="select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="form-control-alternative"
                      >
                        <option value="all">Todos los tipos</option>
                        {tiposLocales.map((tipo) => (
                          <option key={tipo} value={tipo}>
                            {tipo}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <Button
                      color="secondary"
                      block
                      onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("all");
                        setFilterType("all");
                      }}
                    >
                      <FaFilter className="mr-1" />
                      Limpiar
                    </Button>
                  </Col>
                </Row>

                {/* Tabla */}
                <div className="table-responsive">
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Local</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Calificación</th>
                        <th scope="col">Evaluaciones</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLocales.map((local) => (
                        <tr key={local.id}>
                          <th scope="row">
                            <div className="media align-items-center">
                              <div className="media-body">
                                <span className="name mb-0 text-sm">
                                  {local.nombre}
                                </span>
                                <div className="text-muted">
                                  <FaMapMarkerAlt className="mr-1" />
                                  {local.direccion}
                                </div>
                              </div>
                            </div>
                          </th>
                          <td>
                            <Badge color="info">{local.tipo}</Badge>
                          </td>
                          <td>{getStatusBadge(local.estatus)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="mr-2">{local.calificacion}</span>
                              <div>{getRatingStars(local.calificacion)}</div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="mr-2">{local.evaluaciones}</span>
                              <div>
                                <div className="progress">
                                  <div
                                    style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}
                                    role="progressbar"
                                    style={{
                                      width: `${(local.evaluaciones / 50) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{local.fechaCreacion}</td>
                          <td>
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
                                color="success"
                                size="sm"
                                className="mr-1"
                                onClick={() => handleEdit(local)}
                                id={`edit-${local.id}`}
                              >
                                <FaEdit />
                              </Button>
                              <UncontrolledTooltip target={`edit-${local.id}`}>
                                Editar
                              </UncontrolledTooltip>

                              <Button
                                color="warning"
                                size="sm"
                                className="mr-1"
                                id={`qr-${local.id}`}
                              >
                                <FaQrcode />
                              </Button>
                              <UncontrolledTooltip target={`qr-${local.id}`}>
                                Generar QR
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <nav aria-label="Paginación">
                    <Pagination
                      className="justify-content-center"
                      listClassName="justify-content-center"
                    >
                      <PaginationItem disabled={currentPage === 1}>
                        <PaginationLink
                          first
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(1);
                          }}
                        />
                      </PaginationItem>
                      <PaginationItem disabled={currentPage === 1}>
                        <PaginationLink
                          previous
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage - 1);
                          }}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page} active={page === currentPage}>
                            <PaginationLink
                              href="#pablo"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem disabled={currentPage === totalPages}>
                        <PaginationLink
                          next
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                      <PaginationItem disabled={currentPage === totalPages}>
                        <PaginationLink
                          last
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(totalPages);
                          }}
                        />
                      </PaginationItem>
                    </Pagination>
                  </nav>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal para crear/editar/ver local */}
      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          {modalMode === "create" && "Nuevo Local"}
          {modalMode === "edit" && "Editar Local"}
          {modalMode === "view" && "Detalles del Local"}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="nombre">Nombre del Local *</Label>
                  <Input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="tipo">Tipo de Local *</Label>
                  <Input
                    type="select"
                    name="tipo"
                    id="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                  >
                    {tiposLocales.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <Label for="direccion">Dirección *</Label>
                  <Input
                    type="text"
                    name="direccion"
                    id="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="telefono">Teléfono</Label>
                  <Input
                    type="tel"
                    name="telefono"
                    id="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="estatus">Estado *</Label>
                  <Input
                    type="select"
                    name="estatus"
                    id="estatus"
                    value={formData.estatus}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                  >
                    {estadosLocales.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancelar
            </Button>
            {modalMode !== "view" && (
              <Button color="primary" type="submit">
                {modalMode === "create" ? "Crear" : "Guardar"}
              </Button>
            )}
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default Locales; 