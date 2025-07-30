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
import { FaPlus, FaEdit, FaTrash, FaEye, FaKey } from "react-icons/fa";
import { usuariosAPI } from "../utils/api";
import { usePermissions } from "../hooks/usePermissions";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const { canManageUsers, canCreateUsers, canEditUsers, canDeleteUsers, canChangeUserPassword } = usePermissions();

  // Cargar usuarios
  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usuariosAPI.getAll();
      setUsuarios(response.data.usuarios);
    } catch (err) {
      setError("Error al cargar usuarios: " + (err.response?.data?.error || err.message));
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
    setModalOpen(true);
  };

  // Abrir modal para cambiar contraseña
  const openPasswordModal = (usuario) => {
    setSelectedUsuario(usuario);
    setNewPassword("");
    setPasswordModalOpen(true);
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
    try {
      if (modalMode === "create") {
        await usuariosAPI.create(formData);
      } else {
        const { password, ...updateData } = formData;
        await usuariosAPI.update(selectedUsuario.id, updateData);
      }
      
      setModalOpen(false);
      loadUsuarios();
    } catch (err) {
      setError("Error al guardar usuario: " + (err.response?.data?.error || err.message));
    }
  };

  // Eliminar usuario
  const handleDelete = async (usuario) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${usuario.username}"?`)) {
      try {
        await usuariosAPI.delete(usuario.id);
        loadUsuarios();
      } catch (err) {
        setError("Error al eliminar usuario: " + (err.response?.data?.error || err.message));
      }
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async () => {
    try {
      await usuariosAPI.changePassword(selectedUsuario.id, { newPassword });
      setPasswordModalOpen(false);
      setNewPassword("");
      alert("Contraseña cambiada exitosamente");
    } catch (err) {
      setError("Error al cambiar contraseña: " + (err.response?.data?.error || err.message));
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
        {error && (
          <Alert color="danger" className="mb-4">
            {error}
            <Button
              close
              onClick={() => setError(null)}
              className="ml-auto"
            />
          </Alert>
        )}

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
                            
                            {canChangeUserPassword && (
                              <Button
                                color="secondary"
                                size="sm"
                                onClick={() => openPasswordModal(usuario)}
                                title="Cambiar contraseña"
                              >
                                <FaKey />
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
        <ModalHeader toggle={() => setModalOpen(false)}>
          {modalMode === "create" ? "Nuevo Usuario" : 
           modalMode === "edit" ? "Editar Usuario" : "Ver Usuario"}
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
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required={modalMode === "create"}
                  />
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
                  <Label for="rol">Rol *</Label>
                  <Input
                    id="rol"
                    name="rol"
                    type="select"
                    value={formData.rol}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    required
                  >
                    <option value="normal">Normal</option>
                    <option value="administrador">Administrador</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup check className="mt-4">
                  <Label check>
                    <Input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                    />
                    Usuario Activo
                  </Label>
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

      {/* Modal para cambiar contraseña */}
      <Modal isOpen={passwordModalOpen} toggle={() => setPasswordModalOpen(false)}>
        <ModalHeader toggle={() => setPasswordModalOpen(false)}>
          Cambiar Contraseña
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="newPassword">Nueva Contraseña *</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </FormGroup>
          {selectedUsuario && (
            <p className="text-muted">
              Cambiando contraseña para: <strong>{selectedUsuario.username}</strong>
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setPasswordModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleChangePassword}>
            Cambiar Contraseña
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Usuarios; 