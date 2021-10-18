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
    NOTIFICATION_TYPES: {
        NEW_REQUEST: {
            value: "NEW_REQUEST",
            text: "Vous avez une nouvelle demande de test pour le produit :",
            icon: "fa fa-question",
            color: "primary",
            to: "/dashboard/received-requests"
        },
        REQUEST_ACCEPTED: {
            value: "REQUEST_ACCEPTED",
            text: "Votre demande de test a été acceptée pour le produit :",
            icon: "fa-thumbs-up",
            color: "success",
            to: "/dashboard/my-current-tests"
        },
        REQUEST_DECLINED: {
            value: "REQUEST_DECLINED",
            text: "Votre demande de test a été refusée pour le produit :",
            icon: "fa-thumbs-down",
            color: "danger",
            to: "/dashboard/sent-requests"
        },
        REQUEST_CANCELLED: {
            value: "REQUEST_CANCELLED",
            text: "La demande de test a été annulée pour le produit :",
            icon: "fa-cross",
            color: "danger",
            to: "/dashboard/received-requests"
        },
        PRODUCT_ORDERED: {
            value: "PRODUCT_ORDERED",
            text: "Le produit a été commandé :",
            icon: "fa-truck",
            color: "primary",
            to: "/dashboard/customer-current-tests"
        },
        PRODUCT_RECEIVED: {
            value: "PRODUCT_RECEIVED",
            text: "Le produit a été indiqué comme reçu :",
            icon: "fa-box-open",
            color: "primary",
            to: "/dashboard/customer-current-tests"
        },
        PRODUCT_REVIEWED: {
            value: "PRODUCT_REVIEWED",
            text: "Le produit a été indiqué comme noté et commenté :",
            icon: "fa-star",
            color: "success",
            to: "/dashboard/customer-current-tests"
        },
        REVIEW_VALIDATED: {
            value: "REVIEW_VALIDATED",
            text: "Le vendeur a confirmé le commentaire du produit :",
            icon: "fa-star",
            color: "success",
            to: "/dashboard/my-current-tests"
        },
        REVIEW_REFUSED: {
            value: "REVIEW_REFUSED",
            text: "Le vendeur a refusé le commentaire du produit :",
            icon: "fa-star",
            color: "danger",
            to: "/dashboard/my-current-tests"
        },
        MONEY_SENT: {
            value: "MONEY_SENT",
            text: "Le vendeur vous a remboursé suite à votre test produit :",
            icon: "fa-dollar-sign",
            color: "success",
            to: "/dashboard/my-current-tests"
        },
        MONEY_RECEIVED: {
            value: "MONEY_RECEIVED",
            text: "Le Testeur a indiqué avoir reçu le remboursement pour le produit :",
            icon: "fa-dollar-sign",
            color: "success",
            to: "/dashboard/finished-tests"
        },
        TEST_CANCELLED: {
            value: "TEST_CANCELLED",
            text: "Une annulation ou une réclamation a été faite sur le produit :",
            icon: "fa-times",
            color: "danger",
            to: "/dashboard/my-current-tests"
        }
    }
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

