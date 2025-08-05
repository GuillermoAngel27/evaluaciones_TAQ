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
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaFilter } from "react-icons/fa";
import { usuariosAPI } from "../utils/api";
import { usePermissions } from "../hooks/usePermissions";
import Swal from 'sweetalert2';

const Usuarios = () => {
  // Estilos CSS personalizados para dropdowns modernos
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .modern-select {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e") !important;
        background-position: right 16px center !important;
        background-repeat: no-repeat !important;
        background-size: 20px !important;
        padding: 14px 20px !important;
        padding-right: 50px !important;
        border: 2px solid #e9ecef !important;
        border-radius: 12px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        color: #495057 !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
        cursor: pointer !important;
        min-height: 50px !important;
        /* Ocultar flecha nativa en diferentes navegadores */
        text-indent: 0.01px !important;
        text-overflow: '' !important;
        -ms-expand: none !important;
      }
      
      .modern-select:hover {
        border-color: #7e3866 !important;
        background: linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%) !important;
        box-shadow: 0 4px 16px rgba(126, 56, 102, 0.15) !important;
        transform: translateY(-2px) !important;
      }
      
      .modern-select:focus {
        border-color: #7e3866 !important;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
        box-shadow: 0 0 0 4px rgba(126, 56, 102, 0.1) !important;
        outline: none !important;
        transform: translateY(-1px) !important;
      }

      .modern-select:disabled {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
        color: #6c757d !important;
        cursor: not-allowed !important;
        opacity: 0.7 !important;
      }
      
      .custom-select-wrapper {
        position: relative;
      }
      
      .modern-select option {
        padding: 16px 20px !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        background: white !important;
        color: #495057 !important;
        border: none !important;
        transition: all 0.2s ease !important;
      }
      
      .modern-select option:hover {
        background: linear-gradient(135deg, #7e3866 0%, #b18da5 100%) !important;
        color: white !important;
        transform: translateX(4px) !important;
      }

      .modern-select option:checked {
        background: linear-gradient(135deg, #7e3866 0%, #b18da5 100%) !important;
        color: white !important;
        font-weight: 600 !important;
      }

      /* Estilos para el contenedor del select */
      .modern-select-container {
        position: relative !important;
      }

      /* Estilos para botones móviles */
      .mobile-button {
        transition: all 0.3s ease !important;
        border-radius: 8px !important;
        font-weight: 500 !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
      }

      .mobile-button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
      }

      .mobile-button:active {
        transform: translateY(0) !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
      }

      /* Responsive para botones en móviles */
      @media (max-width: 576px) {
        .mobile-button {
          min-width: 120px !important;
          padding: 12px 16px !important;
          font-size: 13px !important;
          margin-bottom: 8px !important;
        }
        
        .mobile-button:last-child {
          margin-bottom: 0 !important;
        }
      }

      /* Mejoras para tablets */
      @media (min-width: 577px) and (max-width: 768px) {
        .mobile-button {
          min-width: 130px !important;
          padding: 11px 18px !important;
          font-size: 13px !important;
        }
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

      /* Estilos personalizados para botones de SweetAlert */
      .swal2-confirm-custom {
        background: linear-gradient(135deg, rgb(90, 12, 98) 0%, rgb(220, 1, 127) 100%) !important;
        border: none !important;
        color: white !important;
        font-weight: 600 !important;
        padding: 12px 24px !important;
        border-radius: 8px !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 12px rgba(90, 12, 98, 0.3) !important;
      }

      .swal2-confirm-custom:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 16px rgba(90, 12, 98, 0.4) !important;
        background: linear-gradient(135deg, rgb(100, 12, 108) 0%, rgb(230, 1, 137) 100%) !important;
      }

      .swal2-cancel-custom {
        background: #6c757d !important;
        border: none !important;
        color: white !important;
        font-weight: 600 !important;
        padding: 12px 24px !important;
        border-radius: 8px !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3) !important;
      }

      .swal2-cancel-custom:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 16px rgba(108, 117, 125, 0.4) !important;
        background: #5a6268 !important;
      }

      /* Estilos forzados para badges de rol */
      .badge-rol-administrador {
        background-color: #7e3866 !important;
        color: white !important;
        border: none !important;
        padding: 6px 12px !important;
        border-radius: 6px !important;
        font-size: 10px !important;
        font-weight: 500 !important;
      }

      .badge-rol-normal {
        background-color: #b18da5 !important;
        color: white !important;
        border: none !important;
        padding: 6px 12px !important;
        border-radius: 6px !important;
        font-size: 10px !important;
        font-weight: 500 !important;
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
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRol, setFilterRol] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const { canManageUsers, canCreateUsers, canEditUsers, canDeleteUsers } = usePermissions();

  // Cargar usuarios
  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuariosAPI.getAll();
      setUsuarios(response.data.usuarios);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar usuarios',
        text: err.response?.data?.error || err.message,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageUsers) {
      loadUsuarios();
    }
  }, [canManageUsers]);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRol, filterEstado]);

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
  const openEditModal = async (usuario) => {
    try {
      setModalMode("edit");
      setSelectedUsuario(usuario);
      
      // Obtener información completa del usuario incluyendo contraseña
      const response = await usuariosAPI.getById(usuario.id);
      const usuarioCompleto = response.data.usuario;
      
      setFormData({
        username: usuarioCompleto.username,
        password: "••••••••", // Placeholder para mostrar que existe contraseña
        nombre: usuarioCompleto.nombre,
        apellido: usuarioCompleto.apellido,
        rol: usuarioCompleto.rol,
        activo: usuarioCompleto.activo,
        passwordHash: usuarioCompleto.password, // Guardar hash para referencia
      });
      setShowPassword(false); // Resetear visibilidad de contraseña
      setModalOpen(true);
    } catch (err) {
      console.error('Error obteniendo información del usuario:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar información del usuario',
        text: 'No se pudo obtener la información del usuario seleccionado',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
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
    if (modalMode === "edit" && formData.password === "••••••••") {
      // Si está en modo edición y tiene placeholder, mostrar información de la contraseña
      Swal.fire({
        icon: 'info',
        title: '🔒 Información de la contraseña',
        html: `
          <div style="text-align: left;">
            <p><strong>• El usuario tiene una contraseña configurada</strong></p>
            <p><strong>• Hash de la contraseña:</strong> ${formData.passwordHash ? formData.passwordHash.substring(0, 20) + '...' : 'No disponible'}</p>
            <p><strong>• Para cambiar la contraseña:</strong> Haz clic en el botón ✏️ y luego ingresa la nueva contraseña</p>
            <br>
            <p><strong>⚠️ Por seguridad, no se puede mostrar la contraseña original.</strong></p>
          </div>
        `,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } else {
      // Comportamiento normal para otros casos
      setShowPassword(!showPassword);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Si es el campo de contraseña y está en modo edición, limpiar el placeholder
    if (name === 'password' && modalMode === 'edit' && value !== "••••••••") {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: `Por favor completa los siguientes campos: ${missingFieldNames}`,
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }
    
    try {
      if (modalMode === "create") {
        await usuariosAPI.create(formData);
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado exitosamente',
          text: 'El usuario ha sido creado correctamente',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        // Para edición, solo incluir contraseña si se cambió
        const updateData = { ...formData };
        if (formData.password === "••••••••" || formData.password.trim() === "") {
          // No cambiar la contraseña si está vacía o es el placeholder
          delete updateData.password;
        }
        await usuariosAPI.update(selectedUsuario.id, updateData);
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado exitosamente',
          text: 'Los cambios han sido guardados correctamente',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
      
      setModalOpen(false);
      loadUsuarios();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar usuario',
        text: err.response?.data?.error || err.message,
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  // Eliminar usuario
  const handleDelete = async (usuario) => {
    // Obtener el usuario actual del contexto de autenticación
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Verificar si el usuario intenta eliminarse a sí mismo
    if (currentUser.id === usuario.id) {
      Swal.fire({
        icon: 'error',
        title: '❌ No puedes eliminar tu propia cuenta',
        text: 'Contacta a otro administrador si necesitas eliminar tu cuenta.',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }
    
    // Verificar si es el último administrador
    const administradores = usuarios.filter(u => u.rol === 'administrador' && u.activo);
    if (usuario.rol === 'administrador' && administradores.length <= 1) {
      Swal.fire({
        icon: 'error',
        title: '❌ No puedes eliminar el último administrador',
        text: 'El sistema necesita al menos un administrador activo.',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }
    
    // Confirmación más detallada
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar usuario?',
      html: `
        <div style="text-align: left;">
          <p><strong>¿Estás seguro de que quieres ELIMINAR PERMANENTEMENTE al usuario "${usuario.username}"?</strong></p>
          <br>
          <p><strong>• Nombre:</strong> ${usuario.nombre} ${usuario.apellido}</p>
          <p><strong>• Rol:</strong> ${usuario.rol}</p>
          <p><strong>• Estado:</strong> ${usuario.activo ? 'Activo' : 'Inactivo'}</p>
          <br>
          <p><strong>⚠️ Esta acción ELIMINARÁ el usuario de la base de datos y NO se puede deshacer.</strong></p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: 'linear-gradient(135deg, rgb(90, 12, 98) 0%, rgb(220, 1, 127) 100%)',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      }
    });
    
    if (result.isConfirmed) {
      // Mostrar indicador de carga
      const deleteButton = document.querySelector(`[data-delete-user="${usuario.id}"]`);
      if (deleteButton) {
        deleteButton.disabled = true;
        deleteButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
      }
      
      try {
        await usuariosAPI.delete(usuario.id);
        
        // Mostrar mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: '✅ Usuario eliminado exitosamente',
          text: `El usuario "${usuario.username}" ha sido eliminado correctamente`,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        // Recargar la lista de usuarios
        loadUsuarios();
        
        // Resetear la página a la primera si es necesario
        if (currentUsuarios.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        
      } catch (err) {
        console.error('Error eliminando usuario:', err);
        
        let errorMessage = "Error al eliminar usuario";
        if (err.response?.status === 403) {
          errorMessage = "❌ No tienes permisos para eliminar este usuario";
        } else if (err.response?.status === 404) {
          errorMessage = "❌ Usuario no encontrado";
        } else if (err.response?.data?.error) {
          errorMessage = `❌ ${err.response.data.error}`;
        } else if (err.message) {
          errorMessage = `❌ ${err.message}`;
        }
        
        alert(errorMessage);
        
        // Restaurar el botón
        if (deleteButton) {
          deleteButton.disabled = false;
          deleteButton.innerHTML = '<FaTrash />';
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar usuario',
          text: errorMessage,
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    }
  };



  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  // Función para filtrar usuarios
  const getFilteredUsuarios = () => {
    return usuarios.filter(usuario => {
      // Filtro por búsqueda (nombre, apellido, username)
      const searchMatch = !searchTerm || 
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por rol
      const rolMatch = !filterRol || usuario.rol === filterRol;
      
      // Filtro por estado
      const estadoMatch = !filterEstado || 
        (filterEstado === 'activo' && usuario.activo) ||
        (filterEstado === 'inactivo' && !usuario.activo);
      
      return searchMatch && rolMatch && estadoMatch;
    });
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setFilterRol("");
    setFilterEstado("");
    setCurrentPage(1);
  };

  // Función para manejar cambio de filtros
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1); // Resetear a la primera página cuando se cambia un filtro
    
    switch (filterType) {
      case 'search':
        setSearchTerm(value);
        break;
      case 'rol':
        setFilterRol(value);
        break;
      case 'estado':
        setFilterEstado(value);
        break;
      default:
        break;
    }
  };

  // Obtener usuarios filtrados
  const filteredUsuarios = getFilteredUsuarios();

  // Lógica de paginación con usuarios filtrados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

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
                {/* Filtros y búsqueda */}
                <Row className="mb-4 g-3">
                  {/* Buscar - Ocupa todo el ancho en móviles y tablets verticales */}
                  <Col xs="12" sm="12" md="12" lg="3" xl="2">
                    <FormGroup>
                      <Input
                        type="text"
                        placeholder="Buscar por nombre, apellido o username..."
                        value={searchTerm}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="form-control-alternative"
                      />
                    </FormGroup>
                  </Col>
                  
                  {/* Rol - Mitad en móviles, lado a lado en tablets */}
                  <Col xs="6" sm="6" md="6" lg="3" xl="2">
                    <FormGroup>
                      <div className="custom-select-wrapper">
                        <Input
                          type="select"
                          value={filterRol}
                          onChange={(e) => handleFilterChange('rol', e.target.value)}
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
                          <option value="" style={{ fontWeight: '600', color: '#6c757d' }}>
                            👥 Roles
                          </option>
                          <option value="administrador" style={{ fontWeight: '500' }}>
                            👑 Administrador
                          </option>
                          <option value="normal" style={{ fontWeight: '500' }}>
                            👤 Usuario Normal
                          </option>
                        </Input>
                      </div>
                    </FormGroup>
                  </Col>
                  
                  {/* Estado - Mitad en móviles, lado a lado en tablets */}
                  <Col xs="6" sm="6" md="6" lg="3" xl="2">
                    <FormGroup>
                      <div className="custom-select-wrapper">
                        <Input
                          type="select"
                          value={filterEstado}
                          onChange={(e) => handleFilterChange('estado', e.target.value)}
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
                          <option value="" style={{ fontWeight: '600', color: '#6c757d' }}>
                            📊 Estados
                          </option>
                          <option value="activo" style={{ fontWeight: '500' }}>
                            🟢 Activo
                          </option>
                          <option value="inactivo" style={{ fontWeight: '500' }}>
                            🔴 Inactivo
                          </option>
                        </Input>
                      </div>
                    </FormGroup>
                  </Col>
                  
                  {/* Botón Limpiar - Ancho completo en móviles y tablets */}
                  <Col xs="12" sm="12" md="12" lg="3" xl="3">
                    <Button
                      color="secondary"
                      onClick={clearFilters}
                      style={{ 
                        width: 'auto',
                        minWidth: '120px',
                        padding: '12px 20px'
                      }}
                    >
                      <FaFilter className="mr-1" />
                      Limpiar
                    </Button>
                  </Col>
                </Row>

            {loading ? (
              <div className="text-center py-4">
                <Spinner color="primary" />
                <p className="mt-2">Cargando usuarios...</p>
              </div>
            ) : (
              <>
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
                      {currentUsuarios.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <p className="text-muted mb-0">
                              {filteredUsuarios.length === 0 && usuarios.length > 0 ? 
                                "No se encontraron usuarios que coincidan con los filtros aplicados." :
                                "No hay usuarios registrados en el sistema."
                              }
                            </p>
                            {filteredUsuarios.length === 0 && usuarios.length > 0 && (
                              <Button
                                color="link"
                                onClick={clearFilters}
                                className="mt-2"
                                style={{ fontSize: '14px' }}
                              >
                                🔄 Limpiar filtros
                              </Button>
                            )}
                          </td>
                        </tr>
                      ) : (
                        currentUsuarios.map((usuario) => (
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
                              className={`${usuario.rol === 'administrador' ? 'badge-rol-administrador' : 'badge-rol-normal'}`}
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
                                  data-delete-user={usuario.id}
                                  style={{
                                    transition: 'all 0.2s ease',
                                    minWidth: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <FaTrash />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  </Table>
                </div>
                
                {/* Paginación */}
                {totalPages > 1 && (
                  <Row className="mt-4">
                    <Col>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          📄 Página {currentPage} de {totalPages} • Mostrando {currentUsuarios.length} de {filteredUsuarios.length} usuarios
                          {filteredUsuarios.length !== usuarios.length && (
                            <span className="ml-1">
                              (filtrado de {usuarios.length} total)
                            </span>
                          )}
                        </small>
                        <nav aria-label="Paginación de usuarios">
                          <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button
                                className="page-link border-0"
                                onClick={() => setCurrentPage(currentPage - 1)}
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
                              >
                                <span style={{ fontSize: '12px' }}>«</span>
                              </button>
                            </li>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <li key={page} className="page-item">
                                <button
                                  className="page-link border-0"
                                  onClick={() => setCurrentPage(page)}
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
                                >
                                  {page}
                                </button>
                              </li>
                            ))}
                            
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                              <button
                                className="page-link border-0"
                                onClick={() => setCurrentPage(currentPage + 1)}
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
                      placeholder={modalMode === "edit" ? "•••••••• (Contraseña actual)" : "Ingresa la contraseña"}
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
                        color: modalMode === "edit" && formData.password === "••••••••" ? '#007bff' : '#6c757d',
                        zIndex: 10
                      }}
                      onClick={togglePasswordVisibility}
                      disabled={modalMode === "view"}
                      title={modalMode === "edit" && formData.password === "••••••••" ? "Ver información de la contraseña" : "Mostrar/ocultar contraseña"}
                    >
                      {modalMode === "edit" && formData.password === "••••••••" ? 
                        <span style={{ fontSize: '14px' }}>ℹ️</span> : 
                        (showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />)
                      }
                    </Button>
                    {modalMode === "edit" && formData.password === "••••••••" && (
                      <Button
                        type="button"
                        color="link"
                        className="position-absolute"
                        style={{
                          right: '40px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          padding: '4px 8px',
                          border: 'none',
                          background: 'none',
                          color: '#dc3545',
                          zIndex: 10,
                          fontSize: '12px'
                        }}
                        onClick={() => setFormData(prev => ({ ...prev, password: "" }))}
                        title="Limpiar campo de contraseña"
                      >
                        ✏️
                      </Button>
                    )}
                  </div>
                  {modalMode === "edit" && (
                    <small className="form-text text-muted">
                      <strong>🔒 Contraseña actual:</strong> El usuario tiene una contraseña configurada. 
                      {formData.password === "••••••••" ? 
                        " Haz clic en ℹ️ para ver información de la contraseña, o en ✏️ para cambiarla." :
                        " Ingresa una nueva contraseña para actualizarla."
                      }
                    </small>
                  )}
                  {modalMode === "create" && (
                    <small className="form-text text-muted">
                      <strong>🔑 Nueva contraseña:</strong> Ingresa una contraseña segura para el nuevo usuario.
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
                    <div className="modern-select-container">
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
                        <option value="normal">👤 Usuario Normal</option>
                        <option value="administrador">👑 Administrador</option>
                      </Input>
                    </div>
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