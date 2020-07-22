import Profile from "./views/Profile/Profile.jsx";
import MyProducts from "./views/MyProducts";
import constants from "./helpers/constants";
import TestList from "./views/TestList";
import React from "react";

const {USER_ROLES, TEST_GLOBAL_STATUSES} = constants;

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
    component: () => <TestList
        statuses={['requested', 'requestCancelled', 'requestDeclined']}
        globalStatus={TEST_GLOBAL_STATUSES.REQUESTED}
        title="Demandes Envoyées"
        userRole={USER_ROLES.TESTER}/>,
    layout: "/dashboard",
    role: USER_ROLES.TESTER,
    testCount: 'requested'
  },
  {
    path: "/received-requests",
    name: "Demandes Reçues",
    icon: "far fa-hand-paper",
    color: 'warning',
    component: () => <TestList
        statuses={['requested', 'requestCancelled', 'requestDeclined']}
        globalStatus={TEST_GLOBAL_STATUSES.REQUESTED}
        title="Demandes Reçues"
        userRole={USER_ROLES.SELLER}/>,
    layout: "/dashboard",
    role: USER_ROLES.SELLER,
    testCount: 'requested'
  },
  {
    path: "/my-current-tests",
    name: "Tests en Cours",
    icon: "far fa-arrow-alt-circle-right",
    color: 'primary',
    component: () => <TestList
        statuses={['requestAccepted', 'productOrdered', 'productReceived', 'productReviewed', 'reviewValidated', 'moneySent']}
        globalStatus={TEST_GLOBAL_STATUSES.PROCESSING}
        title="Tests en Cours"
        userRole={USER_ROLES.TESTER}/>,
    layout: "/dashboard",
    role: USER_ROLES.TESTER,
    testCount: 'processing'
  },
  {
    path: "/customer-current-tests",
    name: "Tests en Cours",
    icon: "far fa-arrow-alt-circle-right",
    color: 'primary',
    component: () => <TestList
        statuses={['requestAccepted', 'productOrdered', 'productReceived', 'productReviewed', 'reviewValidated', 'moneySent']}
        globalStatus={TEST_GLOBAL_STATUSES.PROCESSING}
        title="Tests en Cours"
        userRole={USER_ROLES.SELLER}/>,
    layout: "/dashboard",
    role: USER_ROLES.SELLER,
    testCount: 'processing'
  },
  {
    path: "/finished-tests",
    name: "Tests Terminés",
    icon: "far fa-check-circle",
    color: 'success',
    component: () => <TestList
        statuses={['moneyReceived']}
        globalStatus={TEST_GLOBAL_STATUSES.COMPLETED}
        title="Tests Terminés"
        userRole={USER_ROLES.SELLER}/>,
    layout: "/dashboard",
    role: USER_ROLES.SELLER,
    testCount: 'completed'
  },
  {
    path: "/my-finished-tests",
    name: "Tests Terminés",
    icon: "far fa-check-circle",
    color: 'success',
    component: () => <TestList
        statuses={['moneyReceived']}
        globalStatus={TEST_GLOBAL_STATUSES.COMPLETED}
        title="Tests Terminés"
        userRole={USER_ROLES.TESTER}/>,
    layout: "/dashboard",
    role: USER_ROLES.TESTER,
    testCount: 'completed'
  },
  {
    path: "/cancelled-tests",
    name: "Tests Annulés",
    icon: "fa fa-ban",
    color: 'danger',
    component: () => <TestList
        statuses={['testCancelled']}
        globalStatus={TEST_GLOBAL_STATUSES.PROCESSING}
        title="Tests Annulés"
        userRole={USER_ROLES.SELLER}/>,
    layout: "/dashboard",
    role: USER_ROLES.SELLER,
    testCount: 'cancelled'
  },
  {
    path: "/my-cancelled-tests",
    name: "Tests Annulés",
    icon: "fa fa-ban",
    color: 'danger',
    component: () => <TestList
        statuses={['testCancelled']}
        globalStatus={TEST_GLOBAL_STATUSES.PROCESSING}
        title="Tests Annulés"
        userRole={USER_ROLES.TESTER}/>,
    layout: "/dashboard",
    role: USER_ROLES.TESTER,
    testCount: 'cancelled'
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
