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
import Index from "views/Index.js";
import Dashboard from "views/Dashboard.js";
import Locales from "views/Locales.js";
import Evaluaciones from "views/Evaluaciones.js";
import Estadisticas from "views/Estadisticas.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";

var routes = [
  {
    path: "/index",
    name: "Inicio",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-chart-bar-32 text-info",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/locales",
    name: "Gestión de Locales",
    icon: "ni ni-shop text-success",
    component: <Locales />,
    layout: "/admin",
  },
  {
    path: "/evaluaciones",
    name: "Evaluaciones",
    icon: "ni ni-collection text-success",
    component: <Evaluaciones />,
    layout: "/admin",
  },
  {
    path: "/estadisticas",
    name: "Estadísticas",
    icon: "ni ni-chart-pie-35 text-danger",
    component: <Estadisticas />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
];
export default routes;
