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
import { Link } from "react-router-dom";
// reactstrap components
import {
  NavbarBrand,
  Navbar,
  Container,
} from "reactstrap";

const AdminNavbar = () => {
  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark">
        <Container className="px-4">
          <NavbarBrand to="/" tag={Link}>
            <img
              alt="TAQ - Sistema de Evaluaciones"
              src={require("../../assets/img/brand/taqrob.png")}
              style={{ 
                height: 'clamp(60px, 9vw, 120px)', 
                width: 'auto', 
                filter: 'brightness(1.1)',
                transition: 'all 0.3s ease'
              }}
            />
          </NavbarBrand>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
