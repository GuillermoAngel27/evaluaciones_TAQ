import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
} from "reactstrap";
import { useAuth } from "../../context/AuthContext";
import Swal from 'sweetalert2';

const UserMenu = ({ variant = "default" }) => {
  const { user, logout } = useAuth();
  
  // Estilos CSS personalizados para botones de SweetAlert
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: '¿Desea cerrar sesión?',
      text: 'Se cerrará su sesión actual',
      showCancelButton: true,
      confirmButtonColor: 'linear-gradient(135deg, rgb(90, 12, 98) 0%, rgb(220, 1, 127) 100%)',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      }
    });

    if (result.isConfirmed) {
      logout();
    }
  };

  // Configuraciones según el variant
  const config = {
    default: {
      showUsername: true,
      usernameClass: "mb-0 text-sm font-weight-bold text-white",
      usernameSize: "0.9rem",
      avatarSize: "avatar-sm"
    },
    mobile: {
      showUsername: false,
      usernameClass: "mb-0 text-sm font-weight-bold text-dark",
      usernameSize: "0.8rem",
      avatarSize: "avatar-sm"
    },
    compact: {
      showUsername: false,
      usernameClass: "mb-0 text-sm font-weight-bold text-dark",
      usernameSize: "0.8rem",
      avatarSize: "avatar-sm"
    }
  };

  const currentConfig = config[variant] || config.default;

  return (
    <UncontrolledDropdown nav>
      <DropdownToggle className="pr-0" nav>
        <Media className="align-items-center">
          <span className={`avatar ${currentConfig.avatarSize} rounded-circle`}>
            <img
              alt="Usuario TAQ"
              src={require("../../assets/img/theme/usertaq.png")}
            />
          </span>
          {currentConfig.showUsername && (
            <Media className="ml-2 d-none d-md-block">
              <span 
                className={currentConfig.usernameClass} 
                style={{ fontSize: currentConfig.usernameSize }}
              >
                {user ? user.username : 'Usuario'}
              </span>
            </Media>
          )}
        </Media>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-arrow" end>
        <DropdownItem className="noti-title" header tag="div">
          <h6 className="text-overflow m-0">¡Bienvenido!</h6>
          {user && (
            <p className="text-muted text-sm mb-0">
              {user.username}
            </p>
          )}
        </DropdownItem>
        <DropdownItem divider />
        {user && (
          <DropdownItem disabled>
            <i className="ni ni-single-02" />
            <span>{user.rol}</span>
          </DropdownItem>
        )}
        <DropdownItem divider />
        <DropdownItem onClick={handleLogout}>
          <i className="ni ni-user-run" />
          <span>Cerrar sesión</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserMenu; 