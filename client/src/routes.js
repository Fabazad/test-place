import Index from "views/Index.jsx";
import Profile from "./views/Profile/Profile.jsx";
import MyProducts from "./views/MyProducts";
import SentDemands from "./views/SentDemands";
import ReceivedDemands from "./views/ReceivedDemands";
import constants from "./helpers/constants";
import MyCurrentTests from "./views/MyCurrentTests/MyCurrentTests";
import CustomerCurrentTests from "./views/CustomerCurrentTests/CustomerCurrentTests";
import FinishedTests from "./views/FinishedTests";

const {USER_ROLES} = constants;

const routes = [
  {
    path: "/my-products",
    name: "Mes Produits",
    icon: "ni ni-bag-17 text-blue",
    component: MyProducts,
    layout: "/dashboard",
    role: USER_ROLES.SELLER
  },
  {
    path: "/sent-requests",
    name: "Demandes Envoyées",
    icon: "far fa-hand-paper text-yellow",
    component: SentDemands,
    layout: "/dashboard",
    role: USER_ROLES.TESTER

  },
  {
    path: "/received-requests",
    name: "Demandes Reçues",
    icon: "far fa-hand-paper text-yellow",
    component: ReceivedDemands,
    layout: "/dashboard",
    role: USER_ROLES.SELLER
  },
  {
    path: "/my-current-tests",
    name: "Mes Tests en Cours",
    icon: "far fa-arrow-alt-circle-right text-red",
    component: MyCurrentTests,
    layout: "/dashboard",
    role: USER_ROLES.TESTER
  },
  {
    path: "/customer-current-tests",
    name: "Tests Clients en Cours",
    icon: "far fa-arrow-alt-circle-right text-red",
    component: CustomerCurrentTests,
    layout: "/dashboard",
    role: USER_ROLES.SELLER
  },
  {
    path: "/finished-tests",
    name: "Les Tests Terminés",
    icon: "far fa-check-circle text-green",
    component: FinishedTests,
    layout: "/dashboard",
    role: USER_ROLES.SELLER
  },
  {
    path: "/my-finished-tests",
    name: "Mes Tests Terminés",
    icon: "far fa-check-circle text-green",
    component: MyCurrentTests,
    layout: "/dashboard",
    role: USER_ROLES.TESTER
  },
  {
    path: "/my-profile",
    name: "Mon Profil",
    icon: "fa fa-user text-info",
    component: Profile,
    layout: "/dashboard"
  }
];

export default routes;
