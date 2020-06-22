import Profile from "./views/Profile/Profile.jsx";
import MyProducts from "./views/MyProducts";
import SentDemands from "./views/SentDemands";
import ReceivedDemands from "./views/ReceivedDemands";
import constants from "./helpers/constants";
import MyCurrentTests from "./views/MyCurrentTests/MyCurrentTests";
import CustomerCurrentTests from "./views/CustomerCurrentTests/CustomerCurrentTests";
import FinishedTests from "./views/FinishedTests";
import MyFinishedTests from "./views/MyFinishedTests";

const {USER_ROLES} = constants;

const routes = [
  {
    path: "/my-products",
    name: "Mes Produits",
    icon: "ni ni-bag-17",
    color: 'primary',
    component: MyProducts,
    layout: "/dashboard",
    role: USER_ROLES.SELLER
  },
  {
    path: "/sent-requests",
    name: "Demandes Envoyées",
    icon: "far fa-hand-paper",
    color: 'warning',
    component: SentDemands,
    layout: "/dashboard",
    role: USER_ROLES.TESTER,
    testCount: 'requested'
  },
  {
    path: "/received-requests",
    name: "Demandes Reçues",
    icon: "far fa-hand-paper",
    color: 'warning',
    component: ReceivedDemands,
    layout: "/dashboard",
    role: USER_ROLES.SELLER,
    testCount: 'requested'
  },
  {
    path: "/my-current-tests",
    name: "Mes Tests en Cours",
    icon: "far fa-arrow-alt-circle-right",
    color: 'danger',
    component: MyCurrentTests,
    layout: "/dashboard",
    role: USER_ROLES.TESTER,
    testCount: 'processing'
  },
  {
    path: "/customer-current-tests",
    name: "Tests Clients en Cours",
    icon: "far fa-arrow-alt-circle-right",
    color: 'danger',
    component: CustomerCurrentTests,
    layout: "/dashboard",
    role: USER_ROLES.SELLER,
    testCount: 'processing'
  },
  {
    path: "/finished-tests",
    name: "Les Tests Terminés",
    icon: "far fa-check-circle",
    color: 'success',
    component: FinishedTests,
    layout: "/dashboard",
    role: USER_ROLES.SELLER,
    testCount: 'completed'
  },
  {
    path: "/my-finished-tests",
    name: "Mes Tests Terminés",
    icon: "far fa-check-circle",
    color: 'success',
    component: MyFinishedTests,
    layout: "/dashboard",
    role: USER_ROLES.TESTER,
    testCount: 'completed'
  },
  {
    path: "/my-profile",
    name: "Mon Profil",
    icon: "fa fa-user",
    color: 'info',
    component: Profile,
    layout: "/dashboard"
  }
];

export default routes;
