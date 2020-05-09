const constants = {
    MONGO_LOCAL_URL: 'mongodb://127.0.0.1:27017/test-place',
    FRONTEND_LOCAL_URL: 'http://localhost:3000',
    FRONTEND_URL: 'https://test-place.herokuapp.com',
    MAIL_TEMPLATES_IDS: {
        RESET_PASSWORD: "d-d4d5481b37e648b0ad6583ef88d572d6",
        VALIDATE_EMAIL: "d-d1da8fb375f742619f281f9b661f2d05"
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
    }
};

const {TEST_STATUSES, ROLES} = constants;

constants.TEST_STATUS_PROCESSES = {
    [TEST_STATUSES.requestCancelled]: {
        previous: TEST_STATUSES.requested,
        role: ROLES.TESTER,
        param: "cancelRequestReason"
    },
    [TEST_STATUSES.requestDeclined]: {
        previous: TEST_STATUSES.requested,
        role: ROLES.SELLER,
        param: "declineRequestReason"
    },
    [TEST_STATUSES.requestAccepted]: {
        previous: TEST_STATUSES.requested,
        role: ROLES.SELLER,
        param: "sellerMessage"
    },
    [TEST_STATUSES.productOrdered]: {
        previous: TEST_STATUSES.requestAccepted,
        role: ROLES.TESTER,
        param: "estimatedDeliveryDate"
    },
    [TEST_STATUSES.productReceived]: {
        previous: TEST_STATUSES.productOrdered,
        role: ROLES.TESTER
    },
    [TEST_STATUSES.productReviewed]: {
        previous: TEST_STATUSES.productReceived,
        role: ROLES.TESTER
    },
    [TEST_STATUSES.reviewValidated]: {
        previous: TEST_STATUSES.productReviewed,
        role: ROLES.SELLER
    },
    [TEST_STATUSES.reviewDeclined]: {
        previous: TEST_STATUSES.productReviewed,
        role: ROLES.SELLER,
        param: 'declineReviewReason'
    }
};

module.exports = constants;
