import Index from "views/Index.jsx";
import Profile from "views/examples/Profile.jsx";
import Maps from "views/examples/Maps.jsx";
import Tables from "views/examples/Tables.jsx";
import MyProducts from "./views/MyProducts";

const routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/dashboard"
  },
  {
    path: "/my-products",
    name: "Mes Produits",
    icon: "ni ni-bag-17 text-blue",
    component: MyProducts,
    layout: "/dashboard"
  },
  {
    path: "/received-requests",
    name: "Demandes Envoyées",
    icon: "fa fa-hand-paper text-orange",
    component: Maps,
    layout: "/dashboard"
  },
  {
    path: "/sent-requests",
    name: "Demandes Reçues",
    icon: "far fa-hand-paper text-yellow",
    component: Profile,
    layout: "/dashboard"
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/dashboard"
  }
];
export default routes;
