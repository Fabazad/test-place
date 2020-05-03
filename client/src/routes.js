import Index from "views/Index.jsx";
import Profile from "./views/Profile/Profile.jsx";
import MyProducts from "./views/MyProducts";
import SentDemands from "./views/SentDemands";
import ReceivedDemands from "./views/ReceivedDemands";
import constants from "./helpers/constants";
import MyCurrentTests from "./views/MyCurrentTests/MyCurrentTests";

const {USER_ROLES} = constants;

const routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/dashboard",
  },
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
    icon: "fa fa-hand-paper text-orange",
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
    icon: "far fa-arrow-alt-circle-right text-pink",
    component: MyCurrentTests,
    layout: "/dashboard",
    role: USER_ROLES.TESTER
  },
  {
    path: "/my-profile",
    name: "Mon Profil",
    icon: "fa fa-user text-green",
    component: Profile,
    layout: "/dashboard"
  }
];

export default routes;
