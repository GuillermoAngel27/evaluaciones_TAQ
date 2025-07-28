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
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [qrModal, setQrModal] = useState(false);
  const [selectedLocalForQr, setSelectedLocalForQr] = useState(null);

  // Datos de ejemplo basados en la estructura de la BD
  const [locales, setLocales] = useState([
    {
      id: 1,
      nombre: "Restaurante El Buen Sabor",
      tipo_local: "Alimentos",
      estatus: "Activo",
    },
    {
      id: 2,
      nombre: "Café Central",
      tipo_local: "Alimentos",
      estatus: "Activo",
    },
    {
      id: 3,
      nombre: "Pizzería Italia",
      tipo_local: "Alimentos",
      estatus: "Inactivo",
    },
    {
      id: 4,
      nombre: "Bar La Esquina",
      tipo_local: "Alimentos",
      estatus: "Activo",
    },
    {
      id: 5,
      nombre: "Miscelánea El Ahorro",
      tipo_local: "Misceláneas",
      estatus: "Activo",
    },
    {
      id: 6,
      nombre: "Taxi Express",
      tipo_local: "Taxis",
      estatus: "Activo",
    },
    {
      id: 7,
      nombre: "Estacionamiento Centro",
      tipo_local: "Estacionamiento",
      estatus: "Inactivo",
    },
    {
      id: 8,
      nombre: "Miscelánea La Esquina",
      tipo_local: "Misceláneas",
      estatus: "Activo",
    },
  ]);

  const [formData, setFormData] = useState({
    nombre: "",
    tipo_local: "Alimentos",
    estatus: "Activo",
  });

  const tiposLocales = ["Misceláneas", "Alimentos", "Taxis", "Estacionamiento"];
  const estadosLocales = ["Activo", "Inactivo"];



  // Funciones de manejo
  const toggleModal = () => setModal(!modal);

  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      nombre: "",
      tipo_local: "Alimentos",
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
      tipo_local: local.tipo_local,
      estatus: local.estatus,
    });
    toggleModal();
  };

  const handleView = (local) => {
    setModalMode("view");
    setSelectedLocal(local);
    setFormData({
      nombre: local.nombre,
      tipo_local: local.tipo_local,
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

  // Funciones para el modal de QR
  const toggleQrModal = () => setQrModal(!qrModal);
  
  const handleCreateQr = () => {
    setSelectedLocalForQr(null);
    toggleQrModal();
  };

  const handleCreateQrForLocal = (local) => {
    setSelectedLocalForQr(local);
    toggleQrModal();
  };

  const handleGenerateQr = (type) => {
    if (type === 'individual' && selectedLocalForQr) {
      // Generar QR para un local específico
      console.log('Generando QR para:', selectedLocalForQr.nombre);
      alert(`QR generado para: ${selectedLocalForQr.nombre}`);
    } else if (type === 'all') {
      // Generar QR para todos los locales activos
      const activeLocales = locales.filter(local => local.estatus === 'Activo');
      console.log('Generando QR para todos los locales activos:', activeLocales.length);
      alert(`QR generado para ${activeLocales.length} locales activos`);
    }
    toggleQrModal();
  };

  // Filtrado y búsqueda
  const filteredLocales = locales.filter((local) => {
    const matchesSearch = local.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || local.estatus === filterStatus;
    const matchesType = filterType === "all" || local.tipo_local === filterType;
    
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
                <h6 className="h2 text-white d-inline-block mb-0"></h6>
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
                                         <Button
                       color="primary"
                       size="sm"
                       onClick={handleCreate}
                       className="mr-2"
                     >
                       <FaPlus className="mr-1" />
                       Agregar Local
                     </Button>
                    <Button
                      color="success"
                      size="sm"
                      onClick={handleCreateQr}
                    >
                      <FaQrcode className="mr-1" />
                      Crear QR
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Filtros y búsqueda */}
                <Row className="mb-4">
                  <Col md="2">
                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control-alternative"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <div className="custom-select-wrapper">
                        <Input
                          type="select"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
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
                            cursor: 'pointer'
                          }}
                        >
                          <option value="all" style={{ fontWeight: '600', color: '#6c757d' }}>
                            📊 Todos los estados
                          </option>
                          {estadosLocales.map((estado) => (
                            <option key={estado} value={estado} style={{ fontWeight: '500' }}>
                              {estado === 'Activo' ? '🟢 ' : '🔴 '}{estado}
                            </option>
                          ))}
                        </Input>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="2">
                    <FormGroup>
                      <div className="custom-select-wrapper">
                        <Input
                          type="select"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
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
                            cursor: 'pointer'
                          }}
                        >
                          <option value="all" style={{ fontWeight: '600', color: '#6c757d' }}>
                            🏪 Todos los tipos
                          </option>
                          {tiposLocales.map((tipo) => (
                            <option key={tipo} value={tipo} style={{ fontWeight: '500' }}>
                              {tipo === 'Misceláneas' ? '🛒 ' : 
                               tipo === 'Alimentos' ? '🍽️ ' : 
                               tipo === 'Taxis' ? '🚕 ' : 
                               tipo === 'Estacionamiento' ? '🅿️ ' : '🏢 '}{tipo}
                            </option>
                          ))}
                        </Input>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="3">
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
                                
                              </div>
                            </div>
                          </th>
                          <td>
                            <Badge color="info">{local.tipo_local}</Badge>
                          </td>
                                                     <td>{getStatusBadge(local.estatus)}</td>
                           <td>
                             <div className="d-flex">
                               <Button
                                 color="success"
                                 size="sm"
                                 onClick={() => handleEdit(local)}
                                 id={`edit-${local.id}`}
                               >
                                 <FaEdit />
                               </Button>
                               <UncontrolledTooltip target={`edit-${local.id}`}>
                                 Editar
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
               <Col md="12">
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
             </Row>
             <Row>
               <Col md="6">
                 <FormGroup>
                   <Label for="tipo_local" style={{ fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
                     Tipo de Local *
                   </Label>
                   <Input
                     type="select"
                     name="tipo_local"
                     id="tipo_local"
                     value={formData.tipo_local}
                     onChange={handleInputChange}
                     disabled={modalMode === "view"}
                     required
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
                       cursor: 'pointer'
                     }}
                   >
                     {tiposLocales.map((tipo) => (
                       <option key={tipo} value={tipo} style={{ fontWeight: '500' }}>
                         {tipo === 'Misceláneas' ? '🛒 ' : 
                          tipo === 'Alimentos' ? '🍽️ ' : 
                          tipo === 'Taxis' ? '🚕 ' : 
                          tipo === 'Estacionamiento' ? '🅿️ ' : '🏢 '}{tipo}
                       </option>
                     ))}
                   </Input>
                 </FormGroup>
               </Col>
               <Col md="6">
                 <FormGroup>
                   <Label for="estatus" style={{ fontWeight: '600', color: '#495057', marginBottom: '8px' }}>
                     Estado *
                   </Label>
                   <Input
                     type="select"
                     name="estatus"
                     id="estatus"
                     value={formData.estatus}
                     onChange={handleInputChange}
                     disabled={modalMode === "view"}
                     required
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
                       cursor: 'pointer'
                     }}
                   >
                     {estadosLocales.map((estado) => (
                       <option key={estado} value={estado} style={{ fontWeight: '500' }}>
                         {estado === 'Activo' ? '🟢 ' : '🔴 '}{estado}
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

      {/* Modal para Crear QR */}
      <Modal isOpen={qrModal} toggle={toggleQrModal} size="lg">
        <ModalHeader toggle={toggleQrModal}>
          <FaQrcode className="mr-2" />
          Crear Código QR
        </ModalHeader>
        <ModalBody>
          {selectedLocalForQr ? (
            // QR para un local específico
            <div>
              <h5>Generar QR para: {selectedLocalForQr.nombre}</h5>
              <p className="text-muted">
                Se generará un código QR específico para este local que permitirá 
                a los clientes acceder directamente a la evaluación.
              </p>
              <div className="text-center">
                <Button
                  color="primary"
                  size="lg"
                  onClick={() => handleGenerateQr('individual')}
                  className="btn-icon"
                >
                  <FaQrcode className="mr-2" />
                  Generar QR Individual
                </Button>
              </div>
            </div>
          ) : (
            // QR para todos los locales
            <div>
              <h5>Generar Códigos QR</h5>
              <p className="text-muted mb-4">
                Selecciona una opción para generar códigos QR:
              </p>
              
              <Row>
                <Col md="6">
                  <Card className="text-center p-3">
                    <FaQrcode className="text-primary mb-3" size={48} />
                    <h6>QR Individual</h6>
                    <p className="text-muted small">
                      Genera QR para un local específico
                    </p>
                    <Button
                      color="primary"
                      onClick={() => setSelectedLocalForQr('select')}
                      block
                    >
                      Seleccionar Local
                    </Button>
                  </Card>
                </Col>
                <Col md="6">
                  <Card className="text-center p-3">
                    <FaQrcode className="text-success mb-3" size={48} />
                    <h6>QR Masivo</h6>
                    <p className="text-muted small">
                      Genera QR para todos los locales activos
                    </p>
                    <Button
                      color="success"
                      onClick={() => handleGenerateQr('all')}
                      block
                    >
                      Generar Todos
                    </Button>
                  </Card>
                </Col>
              </Row>

              {selectedLocalForQr === 'select' && (
                <div className="mt-4">
                  <h6>Selecciona un Local Activo:</h6>
                  <div className="table-responsive">
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Local</th>
                          <th>Tipo</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {locales
                          .filter(local => local.estatus === 'Activo')
                          .map(local => (
                            <tr key={local.id}>
                              <td>{local.nombre}</td>
                                                             <td>
                                 <Badge color="info">{local.tipo_local}</Badge>
                               </td>
                              <td>
                                <Button
                                  color="primary"
                                  size="sm"
                                  onClick={() => handleCreateQrForLocal(local)}
                                >
                                  <FaQrcode className="mr-1" />
                                  Generar QR
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleQrModal}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Locales; 