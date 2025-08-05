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
import React from "react";
// reactstrap components
import {
  Navbar,
  Nav,
  Container,
} from "reactstrap";
import UserMenu from "../UserMenu";

const AdminNavbar = (props) => {
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
              <UserMenu variant="default" />
            </Nav>
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
