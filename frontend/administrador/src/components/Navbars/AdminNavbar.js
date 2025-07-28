/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { Link, useNavigate } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = (props) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Navegar inmediatamente sin esperar
    navigate('/l/login', { replace: true });
  };
  return (
    <>
      <Navbar 
        className="navbar-top navbar-dark d-none d-md-block" 
        expand="md" 
        id="navbar-main" 
        style={{ 
          background: 'linear-gradient(135deg, #5A0C62 0%, #DC017F 100%)',
          minHeight: '70px'
        }}
      >
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center w-100">
            {/* Lado izquierdo - Título */}
            <span
              className="h4 mb-0 text-white text-uppercase d-none d-md-inline-block"
              style={{ fontSize: '1.1rem' }}
            >
              {props.brandText}
            </span>

            {/* Lado derecho - Usuario solo en desktop/tablet */}
            <Nav className="align-items-center d-none d-lg-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("../../assets/img/theme/team-4-800x800.jpg")}
                      />
                    </span>
                    <Media className="ml-2 d-none d-md-block">
                      <span className="mb-0 text-sm font-weight-bold text-white" style={{ fontSize: '0.9rem' }}>
                        {user ? user.name : 'Usuario'}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" end>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">¡Bienvenido!</h6>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={handleLogout}>
                    <i className="ni ni-user-run" />
                    <span>Cerrar sesión</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
