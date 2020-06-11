const constants = {
    MONGO_LOCAL_URL: 'mongodb://127.0.0.1:27017/test-place',
    FRONTEND_LOCAL_URL: 'http://localhost:3000',
    FRONTEND_URL: 'https://www.testplace.fr',
    MAIL_TEMPLATES_IDS: {
        RESET_PASSWORD: "d-d4d5481b37e648b0ad6583ef88d572d6",
        VALIDATE_EMAIL: "d-d1da8fb375f742619f281f9b661f2d05",
        CONTACT_US: "d-f6c3402ef59f461a8657f3b3c3cde90f"
    },
    FROM_MAIL_ADDRESS: 'review@test-place.com',
    ROLES: {
        TESTER: "TESTER",
        SELLER: "SELLER",
        ADMIN: "ADMIN"
    },
    PRODUCT_CATEGORIES: [
        { text: 'Animalerie', value: 'pet-shop' },
        { text: 'Auto et Moto', value: 'auto-moto' },
        { text: 'Bagages', value: 'baggage' },
        { text: 'Beauté et Parfum', value: 'beauty-perfume' },
        { text: 'Bijoux', value: 'jewelry' },
        { text: 'Bricolage', value: 'housing' },
        { text: 'Bébés & Puériculture', value: 'baby' },
        { text: 'Chaussures et Sacs', value: 'shoes-bags' },
        { text: 'Cuisine & Maison', value: 'kitchen-house' },
        { text: 'Epicerie', value: 'grocery' },
        { text: 'Fournitures de bureau', value: 'office-supplies' },
        { text: 'Gros électroménager', value: 'appliances' },
        { text: 'High-Tech', value: 'high-tech' },
        { text: 'Hygiène et Santé', value: 'higiene-health' },
        { text: 'Informatique', value: 'computeur-science' },
        { text: 'Instruments de Musique et Sono', value: 'music' },
        { text: 'Jardin', value: 'garden' },
        { text: 'Jeux et Jouets', value: 'games' },
        { text: 'Jeux vidéo', value: 'video-games' },
        { text: 'Luminaires et Eclairage', value: 'lights' },
        { text: 'Mode', value: 'mode' },
        { text: 'Montres', value: 'watch' },
        { text: 'Sports et Loisirs', value: 'sports' },
        { text: 'Vêtements et accessoires', value: 'cloths' },
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
        moneyReceived: "MONEY_RECEIVED"
    },
    // Need to match front ones
    NOTIFICATION_TYPES: {
        NEW_REQUEST: "NEW_REQUEST",
        REQUEST_ACCEPTED: "REQUEST_ACCEPTED",
        REQUEST_DECLINED: "REQUEST_DECLINED",
        REQUEST_CANCELLED: "REQUEST_CANCELLED",
        PRODUCT_ORDERED: "PRODUCT_ORDERED",
        PRODUCT_RECEIVED: "PRODUCT_RECEIVED",
        PRODUCT_REVIEWED: "PRODUCT_REVIEWED",
        REVIEW_VALIDATED: "REVIEW_VALIDATED",
        REVIEW_REFUSED: "REVIEW_REFUSED"
    },
    GENDERS: {
        MALE: "MALE",
        FEMALE: "FEMALE"
    },
};

const {TEST_STATUSES, ROLES, NOTIFICATION_TYPES} = constants;

constants.TEST_STATUS_PROCESSES = {
    [TEST_STATUSES.requestCancelled]: {
        previous: TEST_STATUSES.requested,
        role: ROLES.TESTER,
        param: "cancelRequestReason",
        notificationType: NOTIFICATION_TYPES.PRODUCT_ORDERED
    },
    [TEST_STATUSES.requestDeclined]: {
        previous: TEST_STATUSES.requested,
        role: ROLES.SELLER,
        param: "declineRequestReason",
        notificationType: NOTIFICATION_TYPES.REQUEST_DECLINED
    },
    [TEST_STATUSES.requestAccepted]: {
        previous: TEST_STATUSES.requested,
        role: ROLES.SELLER,
        param: "sellerMessage",
        notificationType: NOTIFICATION_TYPES.REQUEST_ACCEPTED
    },
    [TEST_STATUSES.productOrdered]: {
        previous: TEST_STATUSES.requestAccepted,
        role: ROLES.TESTER,
        param: "orderId",
        notificationType: NOTIFICATION_TYPES.PRODUCT_ORDERED
    },
    [TEST_STATUSES.productReceived]: {
        previous: TEST_STATUSES.productOrdered,
        role: ROLES.TESTER,
        notificationType: NOTIFICATION_TYPES.PRODUCT_RECEIVED
    },
    [TEST_STATUSES.productReviewed]: {
        previous: TEST_STATUSES.productReceived,
        role: ROLES.TESTER,
        notificationType: NOTIFICATION_TYPES.PRODUCT_REVIEWED
    },
    [TEST_STATUSES.reviewValidated]: {
        previous: TEST_STATUSES.productReviewed,
        role: ROLES.SELLER,
        notificationType: NOTIFICATION_TYPES.REVIEW_VALIDATED
    },
    [TEST_STATUSES.reviewDeclined]: {
        previous: TEST_STATUSES.productReviewed,
        role: ROLES.SELLER,
        param: 'declineReviewReason',
        notificationType: NOTIFICATION_TYPES.REVIEW_REFUSED
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
