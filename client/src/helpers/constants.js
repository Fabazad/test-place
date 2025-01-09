export const TestStatus = {
  REQUESTED: "REQUESTED",
  REQUEST_CANCELLED: "REQUEST_CANCELLED",
  REQUEST_DECLINED: "REQUEST_DECLINED",
  REQUEST_ACCEPTED: "REQUEST_ACCEPTED",
  PRODUCT_ORDERED: "PRODUCT_ORDERED",
  PRODUCT_RECEIVED: "PRODUCT_RECEIVED",
  PRODUCT_REVIEWED: "PRODUCT_REVIEWED",
  REVIEW_VALIDATED: "REVIEW_VALIDATED",
  REVIEW_REFUSED: "REVIEW_REFUSED",
  MONEY_SENT: "MONEY_SENT",
  MONEY_RECEIVED: "MONEY_RECEIVED",
  TEST_CANCELLED: "TEST_CANCELLED",
};

const constants = {
  SERVER_DEV_URL: "http://127.0.0.1:5000",
  SERVER_STAGE_URL: "https://stage-test-place.herokuapp.com",
  SERVER_PROD_URL: "https://test-place.herokuapp.com",
  CLIENT_DEV_URL: "http://127.0.0.1:3000",
  CLIENT_PROD_URL: "https://stage-test-place.herokuapp.com",
  BASE_PRODUCT_PICTURE_URL: require("assets/img/theme/shopping-bag.png"),
  AMAZON_APP_ID: "amzn1.application-oa2-client.1dc653b5a0d74449b587f561ea23589a",
  ITEMS_PER_PAGE: 20,
  AMAZON_PARTNER_ID: "ayotech20-21",
  DOMAIN: "test-place.fr",
  GENDERS: {
    MALE: "MALE",
    FEMALE: "FEMALE",
  },
  SORT_BY_OPTIONS: (t) => [
    { text: t("RELEVANCE"), value: "score" },
    { text: t("INITIAL_PRICE"), value: "price" },
    { text: t("FINAL_PRICE"), value: "finalPrice" },
    { text: t("CREATION_DATE"), value: "createdAt" },
  ],
  USER_ROLES: {
    SELLER: "SELLER",
    TESTER: "TESTER",
    ADMIN: "ADMIN",
  },
  TEST_GLOBAL_STATUSES: {
    REQUESTED: "REQUESTED",
    PROCESSING: "PROCESSING",
    COMPLETED: "COMPLETED",
  },
  TEST_ROW_CLICK_ACTIONS: {
    SHOW_TEST: "SHOW_TEST",
    PRODUCT_ORDERED: "PRODUCT_ORDERED",
    PRODUCT_RECEIVED: "PRODUCT_RECEIVED",
    PRODUCT_REVIEWED: "PRODUCT_REVIEWED",
    REVIEW_VALIDATED: "REVIEW_VALIDATED",
    REVIEW_DECLINED: "REVIEW_DECLINED",
    MONEY_SENT: "MONEY_SENT",
    MONEY_RECEIVED: "MONEY_RECEIVED",
    CANCEL_TEST: "CANCEL_TEST",
  },
  ITEMS_PER_PAGE_OPTIONS: [5, 10, 20, 50].map((n) => ({ value: n, text: n })),
  NOTIFICATION_TYPES: (t, isUserTester) => ({
    NEW_REQUEST: {
      value: "NEW_REQUEST",
      text: t("NEW_REQUEST_TEXT"),
      icon: "fa fa-question",
      color: "primary",
      to: "/dashboard/received-requests",
    },
    REQUEST_ACCEPTED: {
      value: "REQUEST_ACCEPTED",
      text: t("REQUEST_ACCEPTED_TEXT"),
      icon: "fa-thumbs-up",
      color: "success",
      to: "/dashboard/my-current-tests",
    },
    REQUEST_DECLINED: {
      value: "REQUEST_DECLINED",
      text: t("REQUEST_DECLINED_TEXT"),
      icon: "fa-thumbs-down",
      color: "danger",
      to: "/dashboard/sent-requests",
    },
    REQUEST_CANCELLED: {
      value: "REQUEST_CANCELLED",
      text: t("REQUEST_CANCELLED_TEXT"),
      icon: "fa-cross",
      color: "danger",
      to: "/dashboard/received-requests",
    },
    PRODUCT_ORDERED: {
      value: "PRODUCT_ORDERED",
      text: t("PRODUCT_ORDERED_TEXT"),
      icon: "fa-truck",
      color: "primary",
      to: "/dashboard/customer-current-tests",
    },
    PRODUCT_RECEIVED: {
      value: "PRODUCT_RECEIVED",
      text: t("PRODUCT_RECEIVED_NOTIFICATION_TEXT"),
      icon: "fa-box-open",
      color: "primary",
      to: "/dashboard/customer-current-tests",
    },
    PRODUCT_REVIEWED: {
      value: "PRODUCT_REVIEWED",
      text: t("PRODUCT_REVIEWED_NOTIFICATION_TEXT"),
      icon: "fa-star",
      color: "success",
      to: "/dashboard/customer-current-tests",
    },
    REVIEW_VALIDATED: {
      value: "REVIEW_VALIDATED",
      text: t("REVIEW_VALIDATED_NOTIFICATION_TEXT"),
      icon: "fa-star",
      color: "success",
      to: "/dashboard/my-current-tests",
    },
    REVIEW_REFUSED: {
      value: "REVIEW_REFUSED",
      text: t("REVIEW_REFUSED_NOTIFICATION_TEXT"),
      icon: "fa-star",
      color: "danger",
      to: "/dashboard/my-current-tests",
    },
    MONEY_SENT: {
      value: "MONEY_SENT",
      text: t("MONEY_SENT_NOTIFICATION_TEXT"),
      icon: "fa-dollar-sign",
      color: "success",
      to: "/dashboard/my-current-tests",
    },
    MONEY_RECEIVED: {
      value: "MONEY_RECEIVED",
      text: t("MONEY_RECEIVED_NOTIFICATION_TEXT"),
      icon: "fa-dollar-sign",
      color: "success",
      to: "/dashboard/finished-tests",
    },
    TEST_CANCELLED: {
      value: "TEST_CANCELLED",
      text: t("TEST_CANCELLED_NOTIFICATION_TEXT"),
      icon: "fa-times",
      color: "danger",
      to: "/dashboard/my-current-tests",
    },
    NEW_MESSAGE: {
      value: "NEW_MESSAGE",
      text: t("NEW_MESSAGE_NOTIFICATION_TEXT"),
      icon: "fa-envelope",
      color: "primary",
      to: isUserTester
        ? "/dashboard/my-current-tests"
        : "/dashboard/customer-current-tests",
    },
  }),
};

export const STEP_KEYS = {
  TEST_ACCEPTATION: "TEST_ACCEPTATION",
  PRODUCT_ORDER: "PRODUCT_ORDER",
  PRODUCT_REVIEW: "PRODUCT_REVIEW",
  REFUND: "REFUND",
  END: "END",
};

export const TEST_STEPS_MAP = (t) => ({
  [constants.USER_ROLES.SELLER]: [
    {
      label: t("TEST_STEP_1_AS_SELLER"),
      key: STEP_KEYS.TEST_ACCEPTATION,
      icon: "fa fa-handshake",
    },
    {
      label: t("TEST_STEP_2_AS_SELLER"),
      key: STEP_KEYS.PRODUCT_ORDER,
      icon: "fa fa-box-open",
    },
    {
      label: t("TEST_STEP_3_AS_SELLER"),
      key: STEP_KEYS.PRODUCT_REVIEW,
      icon: "fa fa-star",
    },
    { label: t("TEST_STEP_4_AS_SELLER"), key: STEP_KEYS.REFUND, icon: "fa fa-euro-sign" },
  ],
  [constants.USER_ROLES.TESTER]: [
    {
      label: t("TEST_STEP_1_AS_TESTER"),
      key: STEP_KEYS.TEST_ACCEPTATION,
      icon: "fa fa-handshake",
    },
    {
      label: t("TEST_STEP_2_AS_TESTER"),
      key: STEP_KEYS.PRODUCT_ORDER,
      icon: "fa fa-box-open",
    },
    {
      label: t("TEST_STEP_3_AS_TESTER"),
      key: STEP_KEYS.PRODUCT_REVIEW,
      icon: "fa fa-star",
    },
    { label: t("TEST_STEP_4_AS_TESTER"), key: STEP_KEYS.REFUND, icon: "fa fa-euro-sign" },
  ],
});

export const TEST_STATUS_TO_STEP_MAP = {
  [constants.USER_ROLES.TESTER]: [
    {
      stepKey: STEP_KEYS.TEST_ACCEPTATION,
      error: false,
      testStatuses: [TestStatus.REQUESTED],
    },
    {
      stepKey: STEP_KEYS.TEST_ACCEPTATION,
      error: true,
      testStatuses: [TestStatus.REQUEST_CANCELLED, TestStatus.REQUEST_DECLINED],
    },
    {
      stepKey: STEP_KEYS.PRODUCT_ORDER,
      error: false,
      testStatuses: [TestStatus.REQUEST_ACCEPTED, TestStatus.PRODUCT_ORDERED],
    },
    {
      stepKey: STEP_KEYS.PRODUCT_REVIEW,
      error: false,
      testStatuses: [TestStatus.PRODUCT_RECEIVED],
    },
    {
      stepKey: STEP_KEYS.REFUND,
      error: false,
      testStatuses: [
        TestStatus.PRODUCT_REVIEWED,
        TestStatus.REVIEW_VALIDATED,
        TestStatus.MONEY_SENT,
      ],
    },
    { stepKey: STEP_KEYS.REFUND, error: true, testStatuses: [TestStatus.REVIEW_REFUSED] },
    { stepKey: STEP_KEYS.END, error: true, testStatuses: [TestStatus.MONEY_RECEIVED] },
    {
      stepKey: STEP_KEYS.TEST_ACCEPTATION,
      error: true,
      testStatuses: [TestStatus.TEST_CANCELLED],
    },
  ],
  [constants.USER_ROLES.SELLER]: [
    {
      stepKey: STEP_KEYS.TEST_ACCEPTATION,
      error: false,
      testStatuses: [TestStatus.REQUESTED],
    },
    {
      stepKey: STEP_KEYS.TEST_ACCEPTATION,
      error: true,
      testStatuses: [TestStatus.REQUEST_CANCELLED, TestStatus.REQUEST_DECLINED],
    },
    {
      stepKey: STEP_KEYS.PRODUCT_ORDER,
      error: false,
      testStatuses: [
        TestStatus.REQUEST_ACCEPTED,
        TestStatus.PRODUCT_ORDERED,
        TestStatus.PRODUCT_RECEIVED,
      ],
    },
    {
      stepKey: STEP_KEYS.PRODUCT_REVIEW,
      error: false,
      testStatuses: [TestStatus.PRODUCT_REVIEWED],
    },
    {
      stepKey: STEP_KEYS.REFUND,
      error: false,
      testStatuses: [TestStatus.REVIEW_VALIDATED, TestStatus.MONEY_SENT],
    },
    { stepKey: STEP_KEYS.REFUND, error: true, testStatuses: [TestStatus.REVIEW_REFUSED] },
    { stepKey: STEP_KEYS.END, error: true, testStatuses: [TestStatus.MONEY_SENT] },
    {
      stepKey: STEP_KEYS.TEST_ACCEPTATION,
      error: true,
      testStatuses: [TestStatus.TEST_CANCELLED],
    },
  ],
};

export default { ...constants };
