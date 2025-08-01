import React, { useState, useEffect } from "react";
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
  Alert,
  Spinner,
} from "reactstrap";
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { usuariosAPI } from "../utils/api";
import { usePermissions } from "../hooks/usePermissions";

const Usuarios = () => {
  // Estilos CSS personalizados para dropdown y checkbox modernos
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
        border: 2px solid #e9ecef !important;
        border-radius: 12px !important;
        padding: 12px 16px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        color: #495057 !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
        transition: all 0.3s ease !important;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
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
        background: white !important;
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

      .modern-checkbox {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 16px 20px !important;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
        border: 2px solid #e9ecef !important;
        border-radius: 12px !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        margin-top: 8px !important;
        min-height: 55px !important;
        position: relative !important;
      }
      
      .modern-checkbox:hover {
        border-color: #5A0C62 !important;
        background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(90, 12, 98, 0.15) !important;
      }
      
      .modern-checkbox input[type="checkbox"] {
        width: 24px !important;
        height: 24px !important;
        margin-right: 20px !important;
        accent-color: #5A0C62 !important;
        cursor: pointer !important;
        border-radius: 6px !important;
        flex-shrink: 0 !important;
        position: relative !important;
        z-index: 1 !important;
      }
      
      .modern-checkbox input[type="checkbox"]:checked {
        background-color: #5A0C62 !important;
        border-color: #5A0C62 !important;
      }
      
      .modern-checkbox-label {
        font-weight: 600 !important;
        color: #495057 !important;
        margin: 0 !important;
        cursor: pointer !important;
        font-size: 14px !important;
        position: absolute !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%) !important;
        pointer-events: none !important;
      }

      .modern-label {
        font-weight: 600 !important;
        color: #495057 !important;
        margin-bottom: 8px !important;
        font-size: 0.9rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        display: block !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nombre: "",
    apellido: "",
    rol: "normal",
    activo: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  const { canManageUsers, canCreateUsers, canEditUsers, canDeleteUsers } = usePermissions();

  // Cargar usuarios
  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuariosAPI.getAll();
      setUsuarios(response.data.usuarios);
    } catch (err) {
      alert("Error al cargar usuarios: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageUsers) {
      loadUsuarios();
    }
  }, [canManageUsers]);

  // Verificar permisos después de los hooks
  if (!canManageUsers) {
    return (
      <Container fluid className="mt-4">
        <Alert color="danger">
          <h4>Acceso Denegado</h4>
          <p>No tienes permisos para acceder a la gestión de usuarios.</p>
        </Alert>
      </Container>
    );
  }

  // Abrir modal para crear usuario
  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUsuario(null);
    setFormData({
      username: "",
      password: "",
      nombre: "",
      apellido: "",
      rol: "normal",
      activo: true,
    });
    setShowPassword(false); // Resetear visibilidad de contraseña
    setModalOpen(true);
  };

  // Abrir modal para editar usuario
  const openEditModal = (usuario) => {
    setModalMode("edit");
    setSelectedUsuario(usuario);
    setFormData({
      username: usuario.username,
      password: "",
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      activo: usuario.activo,
    });
    setShowPassword(false); // Resetear visibilidad de contraseña
    setModalOpen(true);
  };

  // Abrir modal para ver usuario
  const openViewModal = (usuario) => {
    setModalMode("view");
    setSelectedUsuario(usuario);
    setFormData({
      username: usuario.username,
      password: "",
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      activo: usuario.activo,
    });
    setShowPassword(false); // Resetear visibilidad de contraseña
    setModalOpen(true);
  };

  // Función para alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Guardar usuario
  const handleSave = async () => {
    // Validar campos requeridos
    const requiredFields = ['username', 'nombre', 'apellido', 'rol'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        missingFields.push(field);
      }
    });
    
    // Validar contraseña solo en modo crear
    if (modalMode === "create" && (!formData.password || formData.password.trim() === '')) {
      missingFields.push('password');
    }
    
    if (missingFields.length > 0) {
      const fieldNames = {
        username: 'Username',
        password: 'Contraseña',
        nombre: 'Nombre',
        apellido: 'Apellido',
        rol: 'Rol'
      };
      
      const missingFieldNames = missingFields.map(field => fieldNames[field]).join(', ');
      alert(`Por favor completa los siguientes campos: ${missingFieldNames}`);
      return;
    }
    
    try {
      if (modalMode === "create") {
        await usuariosAPI.create(formData);
        alert("Usuario creado exitosamente");
      } else {
        const { password, ...updateData } = formData;
        await usuariosAPI.update(selectedUsuario.id, updateData);
        alert("Usuario actualizado exitosamente");
      }
      
      setModalOpen(false);
      loadUsuarios();
    } catch (err) {
      alert("Error al guardar usuario: " + (err.response?.data?.error || err.message));
    }
  };

  // Eliminar usuario
  const handleDelete = async (usuario) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${usuario.username}"?`)) {
      try {
        await usuariosAPI.delete(usuario.id);
        alert("Usuario eliminado exitosamente");
        loadUsuarios();
      } catch (err) {
        alert("Error al eliminar usuario: " + (err.response?.data?.error || err.message));
      }
    }
  };



  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  return (
    <>
      <div className="header pb-8 pt-5 pt-md-8" style={{ background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)' }}>
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center">
              <Col>
                {/* Header vacío - solo para mantener el espaciado */}
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <Container className="mt--7" fluid>

        <Card className="shadow">
          <CardHeader className="border-0">
            <Row className="align-items-center">
              <div className="col">
                <h3 className="mb-0">Lista de Usuarios</h3>
              </div>
              <div className="col text-right">
                {canCreateUsers && (
                  <Button
                    color="primary"
                    onClick={openCreateModal}
                    className="btn-icon"
                  >
                    <FaPlus />
                    <span className="btn-inner--text">Nuevo Usuario</span>
                  </Button>
                )}
              </div>
            </Row>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="text-center py-4">
                <Spinner color="primary" />
                <p className="mt-2">Cargando usuarios...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Usuario</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Rol</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Fecha Creación</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>
                          <div className="media align-items-center">
                            <div className="media-body">
                              <span className="name mb-0 text-sm">
                                {usuario.username}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {usuario.nombre} {usuario.apellido}
                        </td>
                        <td>
                          <Badge
                            color={usuario.rol === 'administrador' ? 'danger' : 'info'}
                          >
                            {usuario.rol}
                          </Badge>
                        </td>
                        <td>
                          <Badge
                            color={usuario.activo ? 'success' : 'secondary'}
                          >
                            {usuario.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td>
                          {formatDate(usuario.fecha_creacion)}
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <Button
                              color="info"
                              size="sm"
                              onClick={() => openViewModal(usuario)}
                              title="Ver detalles"
                            >
                              <FaEye />
                            </Button>
                            
                            {canEditUsers && (
                              <Button
                                color="warning"
                                size="sm"
                                onClick={() => openEditModal(usuario)}
                                title="Editar"
                              >
                                <FaEdit />
                              </Button>
                            )}
                            

                            
                            {canDeleteUsers && (
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(usuario)}
                                title="Eliminar"
                              >
                                <FaTrash />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardBody>
        </Card>
      </Container>

      {/* Modal para crear/editar usuario */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
        <ModalHeader className="text-white border-0 position-relative" style={{background: 'linear-gradient(135deg, rgb(90, 12, 98) 0%, rgb(220, 1, 127) 100%)'}}>
          <div className="d-flex align-items-center">
            <h4 className="mb-0 text-white">
              {modalMode === "create" ? "Nuevo Usuario" : 
               modalMode === "edit" ? "Editar Usuario" : "Ver Usuario"}
            </h4>
          </div>
          <button 
            type="button" 
            className="btn-close text-white position-absolute" 
            aria-label="Close"
            onClick={() => setModalOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              fontWeight: 'bold',
              cursor: 'pointer',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              top: '15px',
              right: '15px'
            }}
          >
            ×
          </button>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="username">Username *</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="password">
                    Contraseña {modalMode === "create" ? "*" : ""}
                  </Label>
                  <div className="position-relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      required={modalMode === "create"}
                      style={{ paddingRight: '40px' }}
                    />
                    <Button
                      type="button"
                      color="link"
                      className="position-absolute"
                      style={{
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '4px 8px',
                        border: 'none',
                        background: 'none',
                        color: '#6c757d',
                        zIndex: 10
                      }}
                      onClick={togglePasswordVisibility}
                      disabled={modalMode === "view"}
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </Button>
                  </div>
                  {modalMode === "edit" && (
                    <small className="form-text text-muted">
                      Deja vacío para mantener la contraseña actual
                    </small>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    type="text"
                    value={formData.apellido}
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
                    <Label for="rol" className="modern-label">Rol *</Label>
                    <Input
                      id="rol"
                      name="rol"
                      type="select"
                      value={formData.rol}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      required
                      className="modern-select"
                    >
                      <option value="normal">Usuario Normal</option>
                      <option value="administrador">Administrador</option>
                    </Input>
                  </FormGroup>
                </Col>
                              <Col md="6">
                  <FormGroup>
                    <Label className="modern-label">Estado del Usuario</Label>
                    <div 
                      className="modern-checkbox"
                      onClick={() => {
                        if (modalMode !== "view") {
                          handleInputChange({
                            target: {
                              name: 'activo',
                              type: 'checkbox',
                              checked: !formData.activo
                            }
                          });
                        }
                      }}
                    >
                      <Input
                        type="checkbox"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleInputChange}
                        disabled={modalMode === "view"}
                      />
                      <span className="modern-checkbox-label">
                        {formData.activo ? "  Usuario Activo" : "  Usuario Inactivo"}
                      </span>
                    </div>
                  </FormGroup>
                </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          {modalMode !== "view" && (
            <Button color="primary" onClick={handleSave}>
              {modalMode === "create" ? "Crear" : "Guardar"}
            </Button>
          )}
        </ModalFooter>
      </Modal>


    </>
  );
};

export default Usuarios; 