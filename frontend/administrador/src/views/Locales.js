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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
  Pagination,
  PaginationItem,
  PaginationLink,
  Alert,
  Spinner,
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
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartBar,
} from "react-icons/fa";
import { localesAPI } from "../utils/api";
import { generateLocalQRPDF, generateBulkQRPDF } from "../utils/pdfGenerator";
import { usePermissions } from "../hooks/usePermissions";
import Swal from 'sweetalert2';

const Locales = () => {
  const { canCreateLocales, canEditLocales, canDeleteLocales, canGenerateTokens } = usePermissions();
  
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

      /* Estilos forzados para badges de tipo de local */
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

      /* Estilos para botones de acciones */
      .btn-action-edit {
        background-color: #7e3866 !important;
        border-color: #7e3866 !important;
        color: white !important;
        transition: all 0.3s ease !important;
        border-radius: 8px !important;
        padding: 8px 12px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        box-shadow: 0 2px 8px rgba(126, 56, 102, 0.2) !important;
      }

      .btn-action-edit:hover {
        background-color: #6a2f55 !important;
        border-color: #6a2f55 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(126, 56, 102, 0.3) !important;
      }

      .btn-action-view {
        background-color: #7e3866 !important;
        border-color: #7e3866 !important;
        color: white !important;
        transition: all 0.3s ease !important;
        border-radius: 8px !important;
        padding: 8px 12px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        box-shadow: 0 2px 8px rgba(126, 56, 102, 0.2) !important;
      }

      .btn-action-view:hover {
        background-color: #6a2f55 !important;
        border-color: #6a2f55 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(126, 56, 102, 0.3) !important;
      }

      /* Estilos para el modal de vista mejorado */
      .info-item {
        background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        border: 1px solid #e9ecef;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }

      .info-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-color: #5A0C62;
      }

      .info-label {
        color: #6c757d;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .info-value {
        color: #495057;
        font-size: 16px;
        font-weight: 500;
      }

      .stat-card {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: 2px solid #e9ecef;
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        height: 100%;
      }

      .stat-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        border-color: #5A0C62;
      }

      .stat-icon {
        font-size: 32px;
        margin-bottom: 12px;
        display: block;
      }

      .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: #5A0C62;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 12px;
        color: #6c757d;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .evaluation-access-card {
        background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        border: 2px solid #e9ecef;
        border-radius: 16px;
        padding: 24px;
        text-align: center;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }

      .evaluation-access-card:hover {
        border-color: #5A0C62;
        box-shadow: 0 6px 20px rgba(90, 12, 98, 0.1);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Estados para el manejo de datos y UI
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
  const [qrSearchTerm, setQrSearchTerm] = useState("");
  const [showQrDropdown, setShowQrDropdown] = useState(false);

  // Estados para el manejo de datos del backend
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    tipo_local: "miscelaneas",
    estatus: "Activo",
  });
  
  const [nombreError, setNombreError] = useState(false);

  const tiposLocales = ["miscelaneas", "alimentos", "taxis", "estacionamiento"];
  const estadosLocales = ["Activo", "Inactivo"];

  // Cargar datos del backend
  useEffect(() => {
    loadLocales();
  }, []);

  const loadLocales = async () => {
    try {
      setLoading(true);
      const response = await localesAPI.getAll();
      setLocales(response.data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar los locales',
        text: 'Verifica la conexión con el servidor e intenta nuevamente.',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Cerrar dropdown cuando se hace clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showQrDropdown && !event.target.closest('.position-relative')) {
        setShowQrDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQrDropdown]);

  // Funciones de manejo
  const toggleModal = () => setModal(!modal);

  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      nombre: "",
      tipo_local: "miscelaneas",
      estatus: "Activo",
    });
    setSelectedLocal(null);
    setNombreError(false);
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
    setNombreError(false);
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
    setNombreError(false);
    toggleModal();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar local?',
      text: '¿Estás seguro de que quieres eliminar este local? Esta acción no se puede deshacer.',
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
      try {
        await localesAPI.delete(id);
        Swal.fire({
          icon: 'success',
          title: 'Local eliminado exitosamente',
          text: 'El local ha sido eliminado correctamente',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        loadLocales(); // Recargar datos
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar el local',
          text: 'No se pudo eliminar el local. Intenta nuevamente.',
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación del campo nombre
    if (!formData.nombre || formData.nombre.trim() === '') {
      setNombreError(true);
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El nombre del local es obligatorio. Por favor, ingresa un nombre válido.',
        confirmButtonColor: 'linear-gradient(135deg, rgb(90, 12, 98) 0%, rgb(220, 1, 127) 100%)',
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'swal2-confirm-custom'
        }
      });
      return;
    }
    
    // Validación de longitud mínima
    if (formData.nombre.trim().length < 3) {
      setNombreError(true);
      Swal.fire({
        icon: 'warning',
        title: 'Nombre muy corto',
        text: 'El nombre del local debe tener al menos 3 caracteres.',
        confirmButtonColor: 'linear-gradient(135deg, rgb(90, 12, 98) 0%, rgb(220, 1, 127) 100%)',
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'swal2-confirm-custom'
        }
      });
      return;
    }
    
    setSubmitting(true);
    
    try {

      
      if (modalMode === "create") {
        const response = await localesAPI.create(formData);
        Swal.fire({
          icon: 'success',
          title: 'Local creado exitosamente',
          text: 'El local ha sido creado correctamente',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else if (modalMode === "edit") {
        const response = await localesAPI.update(selectedLocal.id, formData);
        Swal.fire({
          icon: 'success',
          title: 'Local actualizado exitosamente',
          text: 'Los cambios han sido guardados correctamente',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
      
      loadLocales(); // Recargar datos
      toggleModal();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar el local',
        text: err.response?.data?.error || 'Error al guardar el local. Intenta nuevamente.',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Limpiar error cuando el usuario empiece a escribir
    if (name === 'nombre' && nombreError) {
      setNombreError(false);
    }
  };

  // Funciones para el modal de QR
  const toggleQrModal = () => {
    setQrModal(!qrModal);
    if (qrModal) {
      // Limpiar estados cuando se cierra el modal
      setSelectedLocalForQr(null);
      setQrSearchTerm("");
      setShowQrDropdown(false);
    }
  };
  
  const handleCreateQr = () => {
    setSelectedLocalForQr(null);
    toggleQrModal();
  };

  const handleCreateQrForLocal = (local) => {
    setSelectedLocalForQr(local);
    toggleQrModal();
  };

  const handleGenerateQr = async (type) => {
    try {
      if (type === 'individual' && selectedLocalForQr) {
        // Generar QR para un local específico
        
        // Mostrar mensaje de carga
        Swal.fire({
          icon: 'info',
          title: 'Generando PDF con QR...',
          text: 'Por favor espera mientras se genera el archivo',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Generar PDF
        const fileName = await generateLocalQRPDF(selectedLocalForQr.nombre, selectedLocalForQr.token_publico);
        
        Swal.fire({
          icon: 'success',
          title: 'PDF generado exitosamente',
          text: `QR generado para: ${selectedLocalForQr.nombre}`,
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        // Limpiar el dropdown y campo de búsqueda
        setSelectedLocalForQr(null);
        setQrSearchTerm("");
        setShowQrDropdown(false);
        
        // No cerrar el modal, permitir generar más QR
      } else if (type === 'all') {
        // Generar QR para todos los locales activos
        const activeLocales = locales.filter(local => local.estatus === 'Activo');
        
        // Mostrar mensaje de carga
        Swal.fire({
          icon: 'info',
          title: 'Generando PDF masivo...',
          text: `Procesando ${activeLocales.length} locales activos`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Generar PDF masivo
        const fileName = await generateBulkQRPDF(activeLocales);
        
        Swal.fire({
          icon: 'success',
          title: 'PDF masivo generado exitosamente',
          text: `QR generados para ${activeLocales.length} locales activos`,
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        // Limpiar el dropdown y campo de búsqueda
        setSelectedLocalForQr(null);
        setQrSearchTerm("");
        setShowQrDropdown(false);
        
        // Cerrar el modal solo para QR masivo
        toggleQrModal();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al generar el PDF',
        text: 'No se pudo generar el archivo. Intenta nuevamente.',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };

  // Funciones para el dropdown con búsqueda
  const handleQrSearchChange = (e) => {
    setQrSearchTerm(e.target.value);
    setShowQrDropdown(true);
  };

  const handleQrLocalSelect = (local) => {
    setSelectedLocalForQr(local);
    setQrSearchTerm(local.nombre);
    setShowQrDropdown(false);
  };

  const filteredQrLocales = locales.filter(local => 
    local.estatus === 'Activo' && 
    local.nombre.toLowerCase().includes(qrSearchTerm.toLowerCase())
  );

  // Filtrado y búsqueda
  const filteredLocales = locales.filter((local) => {
    const matchesSearch = local.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || local.estatus === filterStatus;
    
    // Normalizar el tipo del local para la comparación
    const localTipoNormalizado = local.tipo_local?.toLowerCase() || 'miscelaneas';
    const filterTipoNormalizado = filterType === "all" ? "all" : filterType.toLowerCase();
    const matchesType = filterTipoNormalizado === "all" || localTipoNormalizado === filterTipoNormalizado;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLocales = filteredLocales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocales.length / itemsPerPage);

  // Resetear a la primera página cuando cambian los filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterType]);

  const getStatusBadge = (status) => {
    const colors = {
      Activo: "success",
      Inactivo: "secondary",
    };
    return <Badge color={colors[status]} style={{ fontSize: '14px', padding: '8px 12px' }}>{status}</Badge>;
  };

  // Función para normalizar y mostrar tipos de local
  const getTipoDisplay = (tipo) => {
    const tipoNormalizado = tipo?.toLowerCase() || 'miscelaneas';
    
    switch (tipoNormalizado) {
      case "alimentos":
        return "Alimentos";
      case "miscelaneas":
        return "Misceláneas";
      case "taxis":
        return "Taxis";
      case "estacionamiento":
        return "Estacionamiento";
      default:
        return "Misceláneas";
    }
  };

  // Función para generar URL de evaluación
  const generateEvaluationUrl = (local) => {
    return `http://localhost:3001/${local.token_publico || 'default-token'}`;
  };

  // Función para abrir página de evaluación
  const handleOpenEvaluation = (local) => {
    const evaluationUrl = generateEvaluationUrl(local);
    window.open(evaluationUrl, '_blank');
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  // Mostrar loading
  if (loading) {
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
        <Container className="mt--8" fluid>
          <Row>
            <Col>
              <Card className="shadow">
                <CardBody className="text-center py-5">
                  <Spinner color="primary" size="lg" className="mb-3" />
                  <h5>Cargando locales...</h5>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

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

      <Container className="mt--8" fluid>
        
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Lista de Locales</h3>
                    <small className="text-muted">
                      Total: {locales.length} locales
                    </small>
                  </div>
                  <div className="col text-right">
                    {/* Botones responsivos para móviles */}
                    <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
                      {canCreateLocales && (
                        <Button
                          color="primary"
                          size="sm"
                          onClick={handleCreate}
                          className="mb-2 mb-sm-0 mobile-button"
                          style={{
                            minWidth: '140px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            fontWeight: '500',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <FaPlus className="mr-1" />
                          <span className="d-none d-sm-inline">Agregar Local</span>
                          <span className="d-sm-none">Agregar</span>
                        </Button>
                      )}
                      {canGenerateTokens && (
                        <Button
                          color="success"
                          size="sm"
                          onClick={handleCreateQr}
                          className="mobile-button"
                          style={{
                            minWidth: '140px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            fontWeight: '500',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <FaQrcode className="mr-1" />
                          <span className="d-none d-sm-inline">Crear QR</span>
                          <span className="d-sm-none">QR</span>
                        </Button>
                      )}
                    </div>
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
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control-alternative"
                      />
                    </FormGroup>
                  </Col>
                  
                  {/* Estado - Mitad en móviles, lado a lado en tablets */}
                  <Col xs="6" sm="6" md="6" lg="3" xl="2">
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
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          <option value="all" style={{ fontWeight: '600', color: '#6c757d' }}>
                            📊 Estados
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
                  
                  {/* Tipo - Mitad en móviles, lado a lado en tablets */}
                  <Col xs="6" sm="6" md="6" lg="3" xl="2">
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
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          <option value="all" style={{ fontWeight: '600', color: '#6c757d' }}>
                            🏪 Tipos
                          </option>
                          {tiposLocales.map((tipo) => (
                            <option key={tipo} value={tipo} style={{ fontWeight: '500' }}>
                              {tipo === 'miscelaneas' ? '🛒 ' : 
                               tipo === 'alimentos' ? '🍽️ ' : 
                               tipo === 'taxis' ? '🚕 ' : 
                               tipo === 'estacionamiento' ? '🅿️ ' : '🏢 '}{getTipoDisplay(tipo)}
                            </option>
                          ))}
                        </Input>
                      </div>
                    </FormGroup>
                  </Col>
                  
                  {/* Botón Limpiar - Ancho completo en móviles y tablets */}
                  <Col xs="12" sm="12" md="12" lg="3" xl="3">
                    <Button
                      color="secondary"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("all");
                        setFilterType("all");
                        setCurrentPage(1);
                      }}
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
                      {currentLocales.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-4">
                            <p className="text-muted mb-0">
                              {filteredLocales.length === 0 && locales.length > 0 
                                ? 'No se encontraron locales con los filtros aplicados'
                                : 'No hay locales registrados'
                              }
                            </p>
                          </td>
                        </tr>
                      ) : (
                        currentLocales.map((local) => (
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
                              <Badge
                                className={`${
                                  local.tipo_local === 'alimentos' ? 'badge-tipo-alimentos' :
                                  local.tipo_local === 'miscelaneas' ? 'badge-tipo-miscelaneas' :
                                  local.tipo_local === 'taxis' ? 'badge-tipo-taxis' :
                                  local.tipo_local === 'estacionamiento' ? 'badge-tipo-estacionamiento' : ''
                                }`}
                              >
                                {getTipoDisplay(local.tipo_local)}
                              </Badge>
                            </td>
                            <td>
                              <Badge 
                                color={local.estatus === 'Activo' ? "success" : "secondary"}
                                style={{ fontSize: '10px', padding: '8px 12px' }}
                              >
                                {local.estatus}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                {/* Botón Ver - Siempre visible */}
                                <Button
                                  className="btn-action-view"
                                  size="sm"
                                  onClick={() => handleView(local)}
                                  id={`view-${local.id}`}
                                >
                                  <FaEye />
                                </Button>
                                <UncontrolledTooltip target={`view-${local.id}`}>
                                  Ver
                                </UncontrolledTooltip>

                                {/* Botón Editar - Solo si tiene permisos */}
                                {canEditLocales && (
                                  <>
                                    <Button
                                      className="btn-action-edit"
                                      size="sm"
                                      onClick={() => handleEdit(local)}
                                      id={`edit-${local.id}`}
                                    >
                                      <FaEdit />
                                    </Button>
                                    <UncontrolledTooltip target={`edit-${local.id}`}>
                                      Editar
                                    </UncontrolledTooltip>
                                  </>
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
                      <div className="d-flex justify-content-end align-items-center">
                        {/* Controles de paginación */}
                        <nav aria-label="Paginación de locales">
                          <ul className="pagination pagination-sm mb-0">
                            {/* Botón Anterior */}
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal para crear/editar/ver local */}
      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader className="text-white border-0 position-relative" style={{background: 'linear-gradient(135deg, rgb(90, 12, 98) 0%, rgb(220, 1, 127) 100%)'}}>
          <div className="d-flex align-items-center">
            <h4 className="mb-0 text-white">
              {modalMode === "create" && "Nuevo Local"}
              {modalMode === "edit" && "Editar Local"}
              {modalMode === "view" && "Detalles del Local"}
            </h4>
          </div>
          <button 
            type="button" 
            className="btn-close text-white position-absolute" 
            aria-label="Close"
            onClick={toggleModal}
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
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            {modalMode === "view" ? (
              // Vista de información completa para modo "view"
              <>
                {/* Información del Local */}
                <div className="mb-4">
                  <h5 className="text-primary mb-3">
                    <FaStore className="mr-2" />
                    Información del Local
                  </h5>
                  
                  <Row>
                    <Col md="12" className="mb-3">
                      <div className="info-item">
                        <div className="info-label">
                          <strong>🏪 Nombre del Local:</strong>
                        </div>
                        <div className="info-value">
                          {selectedLocal?.nombre}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md="6" className="mb-3">
                      <div className="info-item">
                        <div className="info-label">
                          <strong>🍽️ Tipo de Local:</strong>
                        </div>
                        <div className="info-value">
                          <Badge
                            className={`${
                              selectedLocal?.tipo_local === 'alimentos' ? 'badge-tipo-alimentos' :
                              selectedLocal?.tipo_local === 'miscelaneas' ? 'badge-tipo-miscelaneas' :
                              selectedLocal?.tipo_local === 'taxis' ? 'badge-tipo-taxis' :
                              selectedLocal?.tipo_local === 'estacionamiento' ? 'badge-tipo-estacionamiento' : ''
                            }`}
                          >
                            {getTipoDisplay(selectedLocal?.tipo_local)}
                          </Badge>
                        </div>
                      </div>
                    </Col>
                    <Col md="6" className="mb-3">
                      <div className="info-item">
                        <div className="info-label">
                          <strong>🟢 Estado:</strong>
                        </div>
                        <div className="info-value">
                          <Badge 
                            color={selectedLocal?.estatus === 'Activo' ? "success" : "secondary"}
                            style={{ fontSize: '12px', padding: '6px 10px' }}
                          >
                            {selectedLocal?.estatus}
                          </Badge>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  

                </div>



                {/* Acceso a Evaluación */}
                <div className="mb-4">
                  <h5 className="text-info mb-3">
                    <FaQrcode className="mr-2" />
                    Acceso a Evaluación
                  </h5>
                  
                  <div className="evaluation-access-card">
                    <div className="text-center mb-3">
                      <p className="text-muted mb-2">
                        Haz clic en el botón para abrir la página de evaluación de este local
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <Button
                        color="primary"
                        size="lg"
                        onClick={() => handleOpenEvaluation(selectedLocal)}
                        style={{
                          background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '15px 30px',
                          fontSize: '16px',
                          fontWeight: '600',
                          boxShadow: '0 4px 15px rgba(90, 12, 98, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 20px rgba(90, 12, 98, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 15px rgba(90, 12, 98, 0.3)';
                        }}
                      >
                        📝 Abrir Página de Evaluación
                      </Button>
                    </div>
                    
                    <div className="text-center mt-3">
                      <small className="text-muted">
                        La página se abrirá en una nueva pestaña
                      </small>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Formulario normal para crear/editar
              <>
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
                        required
                        invalid={nombreError}
                        style={{
                          borderColor: nombreError ? '#dc3545' : '#e9ecef',
                          boxShadow: nombreError ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' : '0 2px 8px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                      {nombreError && (
                        <div className="invalid-feedback d-block">
                          El nombre del local es obligatorio y debe tener al menos 3 caracteres.
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="tipo_local" style={{ 
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#495057',
                        lineHeight: '1.2'
                      }}>
                        Tipo de Local *
                      </Label>
                      <Input
                        type="select"
                        name="tipo_local"
                        id="tipo_local"
                        value={formData.tipo_local}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          marginTop: '0',
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
                            {tipo === 'miscelaneas' ? '🛒 ' : 
                             tipo === 'alimentos' ? '🍽️ ' : 
                             tipo === 'taxis' ? '🚕 ' : 
                             tipo === 'estacionamiento' ? '🅿️ ' : '🏢 '}{getTipoDisplay(tipo)}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="estatus" style={{ 
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#495057',
                        lineHeight: '1.2'
                      }}>
                        Estado *
                      </Label>
                      <Input
                        type="select"
                        name="estatus"
                        id="estatus"
                        value={formData.estatus}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          marginTop: '0',
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
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {modalMode !== "view" && (
              <>
                <Button color="secondary" onClick={toggleModal} disabled={submitting}>
                  Cancelar
                </Button>
                <Button color="primary" type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      {modalMode === "create" ? "Creando..." : "Guardando..."}
                    </>
                  ) : (
                    modalMode === "create" ? "Crear" : "Guardar"
                  )}
                </Button>
              </>
            )}
          </ModalFooter>
        </Form>
      </Modal>

      {/* Modal para Crear QR */}
      <Modal isOpen={qrModal} toggle={toggleQrModal} size="lg">
        <ModalHeader className="text-white border-0 position-relative" style={{background: 'linear-gradient(135deg, rgb(90, 12, 98) 0%, rgb(220, 1, 127) 100%)'}}>
          <div className="d-flex align-items-center">
            <FaQrcode className="mr-2 text-white" />
            <h4 className="mb-0 text-white">Crear Código QR</h4>
          </div>
          <button 
            type="button" 
            className="btn-close text-white position-absolute" 
            aria-label="Close"
            onClick={toggleQrModal}
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
                  
                  <FormGroup className="mt-3">
                    <Label for="qrLocalSearch" className="text-left d-block">Seleccionar Local:</Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        id="qrLocalSearch"
                        placeholder="Escribe para buscar locales activos..."
                        value={qrSearchTerm}
                        onChange={handleQrSearchChange}
                        onFocus={() => setShowQrDropdown(true)}
                        className="form-control-alternative"
                        style={{
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
                      
                      {showQrDropdown && (filteredQrLocales.length > 0 || !qrSearchTerm) && (
                        <div 
                          className="position-absolute w-100 bg-white border rounded shadow-lg"
                          style={{
                            top: '100%',
                            left: 0,
                            zIndex: 9999,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            border: '2px solid #e9ecef',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }}
                        >
                          {filteredQrLocales.length > 0 ? (
                            filteredQrLocales.map(local => (
                              <div
                                key={local.id}
                                className="p-3 border-bottom cursor-pointer"
                                style={{
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s ease',
                                  borderBottom: '1px solid #f8f9fa'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                onClick={() => handleQrLocalSelect(local)}
                              >
                                <div>
                                  <strong style={{ fontSize: '13px' }}>{local.nombre}</strong>
                                  <br />
                                  <small className="text-muted" style={{ fontSize: '11px' }}>{getTipoDisplay(local.tipo_local)}</small>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-muted">
                              No hay locales activos disponibles
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </FormGroup>

                  <Button
                    color="primary"
                    className="mt-3"
                    block
                    disabled={!selectedLocalForQr || selectedLocalForQr === 'select'}
                    onClick={() => handleGenerateQr('individual')}
                  >
                    <FaQrcode className="mr-1" />
                    Generar QR
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
          </div>
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