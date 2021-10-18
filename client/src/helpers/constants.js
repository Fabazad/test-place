const constants = {
    SERVER_DEV_URL: 'http://127.0.0.1:5000',
    SERVER_STAGE_URL: 'https://stage-test-place.herokuapp.com',
    SERVER_PROD_URL: 'https://test-place.herokuapp.com',
    CLIENT_DEV_URL: 'http://127.0.0.1:3000',
    CLIENT_PROD_URL: 'https://stage-test-place.herokuapp.com',
    BASE_PRODUCT_PICTURE_URL: require("assets/img/theme/shopping-bag.png"),
    AMAZON_APP_ID: 'amzn1.application-oa2-client.1dc653b5a0d74449b587f561ea23589a',
    ITEMS_PER_PAGE: 20,
    AMAZON_PARTNER_ID: "ayotech20-21",
    DOMAIN: "testplace.io",
    GENDERS: {
        MALE: "MALE",
        FEMALE: "FEMALE"
    },
    SORT_BY_OPTIONS: (t) => [
        {text: t('RELEVANCE'), value: 'score'},
        {text: t("INITIAL_PRICE"), value: 'price'},
        {text: t("FINAL_PRICE"), value: 'finalPrice'},
        {text: t("CREATION_DATE"), value: 'createdAt'}
    ],
    USER_ROLES: {
        SELLER: 'SELLER',
        TESTER: 'TESTER',
        ADMIN: 'ADMIN'
    },
    TEST_GLOBAL_STATUSES: {
        REQUESTED: "REQUESTED",
        PROCESSING: "PROCESSING",
        COMPLETED: "COMPLETED"
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
        CANCEL_TEST: "CANCEL_TEST"
    },
    ITEMS_PER_PAGE_OPTIONS: [5, 10, 20, 50].map(n => ({value: n, text: n})),
    NOTIFICATION_TYPES: (t) => ({
        NEW_REQUEST: {
            value: "NEW_REQUEST",
            text: t("NEW_REQUEST_TEXT"),
            icon: "fa fa-question",
            color: "primary",
            to: "/dashboard/received-requests"
        },
        REQUEST_ACCEPTED: {
            value: "REQUEST_ACCEPTED",
            text: t("REQUEST_ACCEPTED_TEXT"),
            icon: "fa-thumbs-up",
            color: "success",
            to: "/dashboard/my-current-tests"
        },
        REQUEST_DECLINED: {
            value: "REQUEST_DECLINED",
            text: t("REQUEST_DECLINED_TEXT"),
            icon: "fa-thumbs-down",
            color: "danger",
            to: "/dashboard/sent-requests"
        },
        REQUEST_CANCELLED: {
            value: "REQUEST_CANCELLED",
            text: t("REQUEST_CANCELLED_TEXT"),
            icon: "fa-cross",
            color: "danger",
            to: "/dashboard/received-requests"
        },
        PRODUCT_ORDERED: {
            value: "PRODUCT_ORDERED",
            text: t("PRODUCT_ORDERED_TEXT"),
            icon: "fa-truck",
            color: "primary",
            to: "/dashboard/customer-current-tests"
        },
        PRODUCT_RECEIVED: {
            value: "PRODUCT_RECEIVED",
            text: t("PRODUCT_RECEIVED_NOTIFICATION_TEXT"),
            icon: "fa-box-open",
            color: "primary",
            to: "/dashboard/customer-current-tests"
        },
        PRODUCT_REVIEWED: {
            value: "PRODUCT_REVIEWED",
            text: t("PRODUCT_REVIEWED_NOTIFICATION_TEXT"),
            icon: "fa-star",
            color: "success",
            to: "/dashboard/customer-current-tests"
        },
        REVIEW_VALIDATED: {
            value: "REVIEW_VALIDATED",
            text: t("REVIEW_VALIDATED_NOTIFICATION_TEXT"),
            icon: "fa-star",
            color: "success",
            to: "/dashboard/my-current-tests"
        },
        REVIEW_REFUSED: {
            value: "REVIEW_REFUSED",
            text: t("REVIEW_REFUSED_NOTIFICATION_TEXT"),
            icon: "fa-star",
            color: "danger",
            to: "/dashboard/my-current-tests"
        },
        MONEY_SENT: {
            value: "MONEY_SENT",
            text: t("MONEY_SENT_NOTIFICATION_TEXT"),
            icon: "fa-dollar-sign",
            color: "success",
            to: "/dashboard/my-current-tests"
        },
        MONEY_RECEIVED: {
            value: "MONEY_RECEIVED",
            text: t("MONEY_RECEIVED_NOTIFICATION_TEXT"),
            icon: "fa-dollar-sign",
            color: "success",
            to: "/dashboard/finished-tests"
        },
        TEST_CANCELLED: {
            value: "TEST_CANCELLED",
            text: t("TEST_CANCELLED_NOTIFICATION_TEXT"),
            icon: "fa-times",
            color: "danger",
            to: "/dashboard/my-current-tests"
        }
    })
}

export const STEP_KEYS = {
    TEST_ACCEPTATION: "TEST_ACCEPTATION",
    PRODUCT_ORDER: "PRODUCT_ORDER",
    PRODUCT_REVIEW: "PRODUCT_REVIEW",
    REFUND: "REFUND",
    END: "END"
}

export const TEST_STEPS_MAP = {
    [constants.USER_ROLES.SELLER]: [
        {label: "Acceptation de la demande de test", key: STEP_KEYS.TEST_ACCEPTATION, icon: "fa fa-handshake"},
        {label: "Commande et réception du produit", key: STEP_KEYS.PRODUCT_ORDER, icon: "fa fa-box-open"},
        {label: "Validation de l'avis sur le produit", key: STEP_KEYS.PRODUCT_REVIEW, icon: "fa fa-star"},
        {label: "Remboursement", key: STEP_KEYS.REFUND, icon: "fa fa-euro-sign"},
    ],
    [constants.USER_ROLES.TESTER]: [
        {label: "Demande de test acceptée", key: STEP_KEYS.TEST_ACCEPTATION, icon: "fa fa-handshake"},
        {label: "Commande et réception du produit", key: STEP_KEYS.PRODUCT_ORDER, icon: "fa fa-box-open"},
        {label: "Notation du produit", key: STEP_KEYS.PRODUCT_REVIEW, icon: "fa fa-star"},
        {label: "Remboursement", key: STEP_KEYS.REFUND, icon: "fa fa-euro-sign"},
    ]
}

export const TEST_STATUS_TO_STEP_MAP = {
    [constants.USER_ROLES.TESTER]: [
        {stepKey: STEP_KEYS.TEST_ACCEPTATION, error: false, testStatuses: ['requested']},
        {stepKey: STEP_KEYS.TEST_ACCEPTATION, error: true, testStatuses: ["requestCancelled", 'requestDeclined']},
        {stepKey: STEP_KEYS.PRODUCT_ORDER, error: false, testStatuses: ['requestAccepted', 'productOrdered']},
        {stepKey: STEP_KEYS.PRODUCT_REVIEW, error: false, testStatuses: ['productReceived']},
        {stepKey: STEP_KEYS.REFUND, error: false, testStatuses: ['productReviewed', 'reviewValidated', 'moneySent']},
        {stepKey: STEP_KEYS.REFUND, error: true, testStatuses: ['reviewDeclined']},
        {stepKey: STEP_KEYS.END, error: true, testStatuses: ['moneyReceived']},
        {stepKey: STEP_KEYS.TEST_ACCEPTATION, error: true, testStatuses: ['testCancelled']},
    ],
    [constants.USER_ROLES.SELLER]: [
        {stepKey: STEP_KEYS.TEST_ACCEPTATION, error: false, testStatuses: ['requested']},
        {stepKey: STEP_KEYS.TEST_ACCEPTATION, error: true, testStatuses: ["requestCancelled", 'requestDeclined']},
        {stepKey: STEP_KEYS.PRODUCT_ORDER, error: false, testStatuses: ['requestAccepted', 'productOrdered', 'productReceived']},
        {stepKey: STEP_KEYS.PRODUCT_REVIEW, error: false, testStatuses: ['productReviewed']},
        {stepKey: STEP_KEYS.REFUND, error: false, testStatuses: ['reviewValidated', 'moneySent']},
        {stepKey: STEP_KEYS.REFUND, error: true, testStatuses: ['reviewDeclined']},
        {stepKey: STEP_KEYS.END, error: true, testStatuses: ['moneyReceived']},
        {stepKey: STEP_KEYS.TEST_ACCEPTATION, error: true, testStatuses: ['testCancelled']},

    ]
}

export default {...constants};

