export default {
    SERVER_DEV_URL: 'http://127.0.0.1:5000',
    SERVER_PROD_URL: 'https://stage-test-place.herokuapp.com',
    CLIENT_DEV_URL: 'http://127.0.0.1:3000',
    CLIENT_PROD_URL: 'https://stage-test-place.herokuapp.com',
    BASE_PRODUCT_PICTURE_URL: require("assets/img/theme/shopping-bag.png"),
    AMAZON_APP_ID: 'amzn1.application-oa2-client.1dc653b5a0d74449b587f561ea23589a',
    ITEMS_PER_PAGE: 5,
    AMAZON_PARTNER_ID: "fabazad06-21",
    SORT_BY_OPTIONS: [
        { text: 'Pertinence', value: 'score' },
        { text: 'Prix Initial', value: 'price' },
        { text: 'Coût Final', value: 'finalPrice' },
        { text: 'Date de Création', value: 'createdAt' }
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
        REVIEW_DECLINED: "REVIEW_DECLINED"
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
            to: "/dashboard/sent-requests"
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
        }
    }
}