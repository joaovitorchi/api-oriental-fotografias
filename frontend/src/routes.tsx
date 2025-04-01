/** 
  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// @mui icons
import Icon from "@mui/material/Icon";

import SignInIllustration from "layouts/authentication/sign-in/illustration";
import SignInCover from "layouts/authentication/sign-up/cover";
import ResetCover from "layouts/authentication/reset-password/cover";
import Dashboard from "layouts/Dashboard";
import NewService from "layouts/NewService";
import MyServices from "layouts/MyServices";
import SearchService from "layouts/SearchService";
import EditService from "layouts/EditService";
import ServiceDashboard from "layouts/ServiceDashboard";
import ContractService from "layouts/ContractService";
import MySchedules from "layouts/MySchedules";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Serviços",
    key: "services",
    icon: <Icon fontSize="small">home_repair_service</Icon>,
    route: "/dashboard",
    collapse: [
      {
        name: "Procurar Serviço",
        key: "search-service",
        route: "/procurar-servico",
        component: <SearchService />,
      },
      {
        name: "Novo Serviço",
        key: "novo-servico",
        route: "/novo-servico",
        component: <NewService />,
      },
      {
        name: "Editar Serviço",
        key: "editar-service",
        route: "/editar-servico/:serviceId",
        component: <EditService />,
        type: "title",
        hide: true,
      },
      {
        name: "Meus Serviços",
        key: "services",
        route: "/servicos",
        component: <MyServices />,
      },
      {
        name: "Serviço",
        key: "service",
        route: "/servico/:serviceId",
        component: <ServiceDashboard />,
        hide: true,
      },
    ],
  },
  {
    type: "collapse",
    name: "Contratar Servico",
    key: "contractService",
    route: "/contratar-servico/:serviceId",
    component: <ContractService />,
    noCollapse: true,
    hide: true,
  },
  {
    type: "collapse",
    name: "Meus Agendamentos",
    key: "mySchedules",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/meus-agendamentos",
    component: <MySchedules />,
    noCollapse: true,
    hide: false,
  },
  {
    type: "auth",
    name: "Login",
    key: "login",
    route: "/auth/login",
    component: <SignInIllustration />,
  },
  {
    type: "auth",
    name: "Sign Up",
    key: "sign-up",
    route: "/auth/sign-up",
    component: <SignInCover />,
  },
  {
    type: "auth",
    name: "Reset",
    key: "reset",
    route: "/auth/reset",
    component: <ResetCover />,
  },
];

export default routes;
