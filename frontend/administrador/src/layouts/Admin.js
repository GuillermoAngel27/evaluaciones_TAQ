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
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import ProtectedRoute from "components/ProtectedRoute.js";
import { useAuth } from "context/AuthContext.js";

import routes from "routes.js";
import Dashboard from "views/Dashboard.js";
import Locales from "views/Locales.js";
import Evaluaciones from "views/Evaluaciones.js";
import Estadisticas from "views/Estadisticas.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const [brandText, setBrandText] = React.useState("Inicio");

  React.useEffect(() => {
    // Debug: mostrar información de la ruta actual
    console.log('Current path:', location.pathname);
    console.log('Current location:', location);
    
    // Actualizar el título del navbar cuando cambie la ubicación
    setBrandText(getBrandText(location.pathname));
    
    // Esperar un poco para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      if (mainContent.current) {
        mainContent.current.scrollTop = 0;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/a") {
        return (
          <Route 
            path={prop.path} 
            element={prop.component} 
            key={key} 
          />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    // Filtrar solo las rutas del admin
    const adminRoutes = routes.filter(route => route.layout === "/a");
    
    // Extraer la ruta relativa (sin /a)
    const relativePath = path.replace('/a', '');
    
    for (let i = 0; i < adminRoutes.length; i++) {
      const route = adminRoutes[i];
      
      // Verificar si la ruta actual coincide con la ruta definida
      if (relativePath === route.path || relativePath === route.path + '/') {
        return route.name;
      }
    }
    
    // Si no encuentra coincidencia, verificar si estamos en la ruta raíz del admin
    if (path === "/a" || path === "/a/" || path === "/a/inicio" || relativePath === "/inicio") {
      return "Inicio";
    }
    
    return "Inicio";
  };

  return (
    <ProtectedRoute>
      <>
        <Sidebar
          {...props}
          routes={routes.filter(route => route.layout === "/a")}
          logo={{
            innerLink: "/a/inicio",
            imgSrc: require("../assets/img/brand/argon-react.png"),
            imgAlt: "...",
          }}
        />
        <div className="main-content" ref={mainContent}>
          <AdminNavbar
            {...props}
            brandText={brandText}
          />
          <Routes>
            <Route path="/inicio" element={<Dashboard />} />
            <Route path="/locales" element={<Locales />} />
            <Route path="/evaluaciones" element={<Evaluaciones />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/" element={<Navigate to="inicio" replace />} />
            <Route path="*" element={<Navigate to="inicio" replace />} />
          </Routes>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    </ProtectedRoute>
  );
};

export default Admin;
