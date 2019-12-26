const constants = {
    MONGO_LOCAL_URL: 'mongodb://127.0.0.1:27017/test-place',
    FRONTEND_LOCAL_URL: 'http://localhost:3000',
    FRONTEND_URL: 'https://test-place.herokuapp.com',
    MAIL_TEMPLATES_IDS: {
        RESET_PASSWORD: "d-d4d5481b37e648b0ad6583ef88d572d6",
        VALIDATE_EMAIL: "d-d1da8fb375f742619f281f9b661f2d05"
    },
    FROM_MAIL_ADDRESS: 'test@example.com',
    ROLES: {
        REVIEWER: "reviewer",
        SELLER: "seller"
    },
    PRODUCT_CATEGORIES: [
        { text: 'Electronique', value: 'electronic' },
        { text: 'Ameublement', value: 'house-furniture' },
    ]
};

module.exports = constants;