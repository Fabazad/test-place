const constants = {
    MONGO_LOCAL_URL: 'mongodb://127.0.0.1:27017/test-place',
    FRONTEND_LOCAL_URL: 'http://localhost:3000',
    FRONTEND_URL: 'https://www.testplace.io',
    S3_BUCKET: "test-place",
    MAIL_TEMPLATES_IDS: {
        RESET_PASSWORD: {
            fr: "d-d4d5481b37e648b0ad6583ef88d572d6",
            en: "d-bb68b3f6b9fa4974a594ff5ffb267e4c",
            ch: "d-88b15567c0b940998564bef2f3363578"
        },
        VALIDATE_EMAIL: {
            fr: "d-d1da8fb375f742619f281f9b661f2d05",
            en: "d-4c666327a316434c9d30c5212e429882",
            ch: "d-eafffb5b610f403d8d7b24ca419526f3"
        },
        CONTACT_US: {
            fr: "d-f6c3402ef59f461a8657f3b3c3cde90f",
            en: "d-f6c3402ef59f461a8657f3b3c3cde90f",
            ch: "d-f6c3402ef59f461a8657f3b3c3cde90f"
        },
        NOTIFICATION: {
            fr: "d-141262cf223c4349955b40f956003808",
            en: "d-5e97b4d4dbcd4961861013130b835a71",
            ch: "d-4fc7e2093855454ea5c5d3ad443f6e35"
        }
    },
    FROM_MAIL_ADDRESS: 'testplace.fr@gmail.com',
    ROLES: {
        TESTER: "TESTER",
        SELLER: "SELLER",
        ADMIN: "ADMIN"
    },
    PRODUCT_CATEGORIES: [
        {text: 'Animalerie', value: 'pet-shop'},
        {text: 'Auto et Moto', value: 'auto-moto'},
        {text: 'Bagages', value: 'baggage'},
        {text: 'Beauté et Parfum', value: 'beauty-perfume'},
        {text: 'Bijoux', value: 'jewelry'},
        {text: 'Bricolage', value: 'housing'},
        {text: 'Bébés & Puériculture', value: 'baby'},
        {text: 'Chaussures et Sacs', value: 'shoes-bags'},
        {text: 'Cuisine & Maison', value: 'kitchen-house'},
        {text: 'Epicerie', value: 'grocery'},
        {text: 'Fournitures de bureau', value: 'office-supplies'},
        {text: 'Gros électroménager', value: 'appliances'},
        {text: 'High-Tech', value: 'high-tech'},
        {text: 'Hygiène et Santé', value: 'higiene-health'},
        {text: 'Informatique', value: 'computeur-science'},
        {text: 'Instruments de Musique et Sono', value: 'music'},
        {text: 'Jardin', value: 'garden'},
        {text: 'Jeux et Jouets', value: 'games'},
        {text: 'Jeux vidéo', value: 'video-games'},
        {text: 'Luminaires et Eclairage', value: 'lights'},
        {text: 'Mode', value: 'mode'},
        {text: 'Montres', value: 'watch'},
        {text: 'Sports et Loisirs', value: 'sports'},
        {text: 'Vêtements et accessoires', value: 'cloths'},
    ],
    AUTH_CONDITIONS: {
        IS_SELLER: "IS_SELLER",
        ANY: "ANY"
    },
    TEST_STATUSES: {
        requested: "REQUESTED",
        requestCancelled: "REQUEST_CANCELLED",
        requestDeclined: "REQUEST_DECLINED",
        requestAccepted: "REQUEST_ACCEPTED",
        productOrdered: "PRODUCT_ORDERED",
        productReceived: "PRODUCT_RECEIVED",
        productReviewed: "PRODUCT_REVIEWED",
        reviewValidated: "REVIEW_VALIDATED",
        reviewDeclined: "REVIEW_REFUSED",
        moneySent: "MONEY_SENT",
        moneyReceived: "MONEY_RECEIVED",
        testCancelled: "TEST_CANCELLED"
    },
    GENDERS: {
        MALE: "MALE",
        FEMALE: "FEMALE"
    },
    // Need to match front ones
    NOTIFICATION_TYPES: {
        NEW_REQUEST: {
            value: "NEW_REQUEST",
            title: "Nouvelle demande de test.",
            text: "Vous avez une nouvelle demande de test pour le produit :",
            to: "/dashboard/received-requests"
        },
        REQUEST_ACCEPTED: {
            value: "REQUEST_ACCEPTED",
            title: "Demande de test acceptée.",
            text: "Votre demande de test a été acceptée pour le produit :",
            to: "/dashboard/sent-requests"
        },
        REQUEST_DECLINED: {
            value: "REQUEST_DECLINED",
            title: "Demande de test refusée.",
            text: "Votre demande de test a été refusée pour le produit :",
            to: "/dashboard/sent-requests"
        },
        REQUEST_CANCELLED: {
            value: "REQUEST_CANCELLED",
            title: "Demande de test annulée.",
            text: "La demande de test a été annulée pour le produit :",
            to: "/dashboard/received-requests"
        },
        PRODUCT_ORDERED: {
            value: "PRODUCT_ORDERED",
            title: "Produit commandé.",
            text: "Le produit a été commandé :",
            to: "/dashboard/customer-current-tests"
        },
        PRODUCT_RECEIVED: {
            value: "PRODUCT_RECEIVED",
            title: "Produit reçu.",
            text: "Le produit a été indiqué comme reçu :",
            to: "/dashboard/customer-current-tests"
        },
        PRODUCT_REVIEWED: {
            value: "PRODUCT_REVIEWED",
            title: "Produit commenté.",
            text: "Le produit a été indiqué comme noté et commenté :",
            to: "/dashboard/customer-current-tests"
        },
        REVIEW_VALIDATED: {
            value: "REVIEW_VALIDATED",
            title: "Commentaire confirmé.",
            text: "Le vendeur a confirmé le commentaire du produit :",
            to: "/dashboard/my-current-tests"
        },
        REVIEW_REFUSED: {
            value: "REVIEW_REFUSED",
            title: "Commentaire refusé.",
            text: "Le vendeur a refusé le commentaire du produit :",
            to: "/dashboard/my-current-tests"
        },
        MONEY_SENT: {
            value: "MONEY_SENT",
            title: "Remboursement envoyé.",
            text: "Le vendeur vous a envoyé de l'argent suite au test du produit :",
            to: "/dashboard/my-current-tests"
        },
        TEST_CANCELLED: {
            value: "TEST_CANCELLED",
            title: "Annulation ou Réclamation.",
            text: "Une annulation ou une réclamation a été faite sur le produit :",
            to: "/dashboard/customer-current-tests"
        },
        MONEY_RECEIVED: {
            value: "MONEY_RECEIVED",
            title: "Remboursement reçu.",
            text: "Le tester a indiqué avoir reçu le remboursement sur le produit :",
            to: "/dashboard/finished-tests"
        }
    }
};

const {TEST_STATUSES, ROLES, NOTIFICATION_TYPES} = constants;

constants.GLOBAL_TEST_STATUSES = {
    REQUESTED: [
        TEST_STATUSES.requested,
        TEST_STATUSES.requestCancelled,
        TEST_STATUSES.requestDeclined
    ],
    PROCESSING: [
        TEST_STATUSES.requestAccepted,
        TEST_STATUSES.productOrdered,
        TEST_STATUSES.productReceived,
        TEST_STATUSES.productReviewed,
        TEST_STATUSES.reviewValidated,
        TEST_STATUSES.moneySent
    ],
    COMPLETED: [
        TEST_STATUSES.moneyReceived
    ],
    CANCELLED: [
        TEST_STATUSES.reviewDeclined,
        TEST_STATUSES.testCancelled
    ]
};

constants.TEST_STATUS_PROCESSES = {
    [TEST_STATUSES.requestCancelled]: {
        previous: TEST_STATUSES.requested,
        role: ROLES.TESTER,
        params: ["cancelRequestReason"],
        notificationType: NOTIFICATION_TYPES.PRODUCT_ORDERED.value
    },
    [TEST_STATUSES.requestDeclined]: {
        previous: TEST_STATUSES.requested,
        role: ROLES.SELLER,
        params: ["declineRequestReason"],
        notificationType: NOTIFICATION_TYPES.REQUEST_DECLINED.value
    },
    [TEST_STATUSES.requestAccepted]: {
        previous: TEST_STATUSES.requested,
        role: ROLES.SELLER,
        params: ["sellerMessage"],
        notificationType: NOTIFICATION_TYPES.REQUEST_ACCEPTED.value
    },
    [TEST_STATUSES.productOrdered]: {
        previous: TEST_STATUSES.requestAccepted,
        role: ROLES.TESTER,
        params: ["orderId", "orderScreenshotUrl"],
        notificationType: NOTIFICATION_TYPES.PRODUCT_ORDERED.value
    },
    [TEST_STATUSES.productReceived]: {
        previous: TEST_STATUSES.productOrdered,
        role: ROLES.TESTER,
        notificationType: NOTIFICATION_TYPES.PRODUCT_RECEIVED.value
    },
    [TEST_STATUSES.productReviewed]: {
        previous: TEST_STATUSES.productReceived,
        role: ROLES.TESTER,
        params: ['reviewId'],
        notificationType: NOTIFICATION_TYPES.PRODUCT_REVIEWED.value
    },
    [TEST_STATUSES.reviewValidated]: {
        previous: TEST_STATUSES.productReviewed,
        role: ROLES.SELLER,
        notificationType: NOTIFICATION_TYPES.REVIEW_VALIDATED.value
    },
    [TEST_STATUSES.reviewDeclined]: {
        previous: TEST_STATUSES.productReviewed,
        role: ROLES.SELLER,
        params: ['declineReviewReason'],
        notificationType: NOTIFICATION_TYPES.REVIEW_REFUSED.value
    },
    [TEST_STATUSES.moneySent]: {
        previous: TEST_STATUSES.reviewValidated,
        role: ROLES.SELLER,
        notificationType: NOTIFICATION_TYPES.MONEY_SENT.value
    },
    [TEST_STATUSES.testCancelled]: {
        previous: constants.GLOBAL_TEST_STATUSES.PROCESSING,
        params: ['cancelReason'],
        notificationType: NOTIFICATION_TYPES.TEST_CANCELLED.value
    },
    [TEST_STATUSES.moneyReceived]: {
        previous: [TEST_STATUSES.moneySent, TEST_STATUSES.reviewValidated],
        notificationType: NOTIFICATION_TYPES.MONEY_RECEIVED.value
    }
};

constants.VALID_TEST_STATUSES = [
    TEST_STATUSES.requested,
    TEST_STATUSES.requestAccepted,
    TEST_STATUSES.productOrdered,
    TEST_STATUSES.productReceived,
    TEST_STATUSES.productReviewed,
    TEST_STATUSES.reviewValidated
];

module.exports = constants;
