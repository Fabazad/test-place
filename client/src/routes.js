import React from "react";
import constants, { TestStatus } from "./helpers/constants";
import { Affiliation } from "./views/Affiliation/Affiliation";
import MyProducts from "./views/MyProducts";
import Profile from "./views/Profile/Profile.jsx";
import TestList from "./views/TestList";

const { USER_ROLES, TEST_GLOBAL_STATUSES } = constants;

const routes = (t) => [
  {
    path: "/my-products",
    name: t("MY_PRODUCTS"),
    icon: "ni ni-bag-17",
    color: "primary",
    component: MyProducts,
    layout: "/dashboard",
    role: USER_ROLES.SELLER,
  },
  {
    path: "/sent-requests",
    name: t("SENT_REQUESTS"),
    icon: "far fa-hand-paper",
    color: "warning",
    component: () => (
      <TestList
        statuses={[TestStatus.REQUESTED, TestStatus.REQUEST_DECLINED]}
        globalStatus={TEST_GLOBAL_STATUSES.REQUESTED}
        title={t("SENT_REQUESTS")}
        userRole={USER_ROLES.TESTER}
      />
    ),
    layout: "/dashboard",
    role: USER_ROLES.TESTER,
    testCount: "requested",
  },
  {
    path: "/received-requests",
    name: t("RECEIVED_REQUESTS"),
    icon: "far fa-hand-paper",
    color: "warning",
    component: () => (
      <TestList
        statuses={[TestStatus.REQUESTED, TestStatus.REQUEST_DECLINED]}
        globalStatus={TEST_GLOBAL_STATUSES.REQUESTED}
        title={t("RECEIVED_REQUESTS")}
        userRole={USER_ROLES.SELLER}
      />
    ),
    layout: "/dashboard",
    role: USER_ROLES.SELLER,
    testCount: "requested",
  },
  {
    path: "/my-current-tests",
    name: t("PROCESSING_TESTS"),
    icon: "far fa-arrow-alt-circle-right",
    color: "primary",
    component: () => (
      <TestList
        statuses={[
          TestStatus.REQUEST_ACCEPTED,
          TestStatus.PRODUCT_ORDERED,
          TestStatus.PRODUCT_RECEIVED,
          TestStatus.PRODUCT_REVIEWED,
          TestStatus.REVIEW_VALIDATED,
          TestStatus.MONEY_SENT,
        ]}
        globalStatus={TEST_GLOBAL_STATUSES.PROCESSING}
        title={t("PROCESSING_TESTS")}
        userRole={USER_ROLES.TESTER}
      />
    ),
    layout: "/dashboard",
    role: USER_ROLES.TESTER,
    testCount: "processing",
  },
  {
    path: "/customer-current-tests",
    name: t("PROCESSING_TESTS"),
    icon: "far fa-arrow-alt-circle-right",
    color: "primary",
    component: () => (
      <TestList
        statuses={[
          TestStatus.REQUEST_ACCEPTED,
          TestStatus.PRODUCT_ORDERED,
          TestStatus.PRODUCT_RECEIVED,
          TestStatus.PRODUCT_REVIEWED,
          TestStatus.REVIEW_VALIDATED,
          TestStatus.MONEY_SENT,
        ]}
        globalStatus={TEST_GLOBAL_STATUSES.PROCESSING}
        title={t("PROCESSING_TESTS")}
        userRole={USER_ROLES.SELLER}
      />
    ),
    layout: "/dashboard",
    role: USER_ROLES.SELLER,
    testCount: "processing",
  },
  {
    path: "/finished-tests",
    name: t("FINISHED_TESTS"),
    icon: "far fa-check-circle",
    color: "success",
    component: () => (
      <TestList
        statuses={[TestStatus.MONEY_RECEIVED]}
        globalStatus={TEST_GLOBAL_STATUSES.COMPLETED}
        title={t("FINISHED_TESTS")}
        userRole={USER_ROLES.SELLER}
      />
    ),
    layout: "/dashboard",
    role: USER_ROLES.SELLER,
    testCount: "completed",
  },
  {
    path: "/my-finished-tests",
    name: t("FINISHED_TESTS"),
    icon: "far fa-check-circle",
    color: "success",
    component: () => (
      <TestList
        statuses={[TestStatus.MONEY_RECEIVED]}
        globalStatus={TEST_GLOBAL_STATUSES.COMPLETED}
        title={t("FINISHED_TESTS")}
        userRole={USER_ROLES.TESTER}
      />
    ),
    layout: "/dashboard",
    role: USER_ROLES.TESTER,
    testCount: "completed",
  },
  {
    path: "/cancelled-tests",
    name: t("CANCELLED_TESTS"),
    icon: "fa fa-ban",
    color: "danger",
    component: () => (
      <TestList
        statuses={[
          TestStatus.TEST_CANCELLED,
          TestStatus.REVIEW_REFUSED,
          TestStatus.REQUEST_CANCELLED,
          TestStatus.REQUEST_CANCELLED,
        ]}
        globalStatus={TEST_GLOBAL_STATUSES.PROCESSING}
        title={t("CANCELLED_TESTS")}
        userRole={USER_ROLES.SELLER}
      />
    ),
    layout: "/dashboard",
    role: USER_ROLES.SELLER,
    testCount: "cancelled",
  },
  {
    path: "/my-cancelled-tests",
    name: t("CANCELLED_TESTS"),
    icon: "fa fa-ban",
    color: "danger",
    component: () => (
      <TestList
        statuses={[
          TestStatus.TEST_CANCELLED,
          TestStatus.REVIEW_REFUSED,
          TestStatus.REQUEST_CANCELLED,
        ]}
        globalStatus={TEST_GLOBAL_STATUSES.PROCESSING}
        title={t("CANCELLED_TESTS")}
        userRole={USER_ROLES.TESTER}
      />
    ),
    layout: "/dashboard",
    role: USER_ROLES.TESTER,
    testCount: "cancelled",
  },
  {
    path: "/admin-cancelled-tests",
    name: "Tests en Conflits",
    icon: "fa fa-heart-broken",
    color: "danger",
    component: () => (
      <TestList
        statuses={[TestStatus.TEST_CANCELLED, TestStatus.REVIEW_REFUSED]}
        globalStatus={TEST_GLOBAL_STATUSES.PROCESSING}
        title={t("CANCELLED_TESTS")}
        adminView={true}
        userRole={USER_ROLES.ADMIN}
      />
    ),
    layout: "/dashboard",
    role: USER_ROLES.ADMIN,
  },
  {
    path: "/my-profile",
    name: t("MY_PROFILE"),
    icon: "fa fa-user",
    color: "info",
    component: Profile,
    layout: "/dashboard",
  },
  {
    path: "/affiliation",
    name: t("AFFILIATION"),
    icon: "fa fa-user-tag",
    color: "promotion",
    component: Affiliation,
    layout: "/dashboard",
  },
];

export default routes;
