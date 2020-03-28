export default {
    SERVER_DEV_URL: 'http://127.0.0.1:5000',
    SERVER_PROD_URL: 'https://test-place.herokuapp.com',
    CLIENT_DEV_URL: 'http://127.0.0.1:3000',
    CLIENT_PROD_URL: 'https://test-place.herokuapp.com',
    BASE_PRODUCT_PICTURE_URL: require("assets/img/theme/shopping-bag.png"),
    AMAZON_APP_ID: 'amzn1.application-oa2-client.1dc653b5a0d74449b587f561ea23589a',
    ITEMS_PER_PAGE: 2,
    SORT_BY_OPTIONS: [
        { text: 'Pertinence', value: 'score' },
        { text: 'Prix Initial', value: 'price' },
        { text: 'Coût Final', value: 'finalPrice' },
        { text: 'Date de Création', value: 'createdAt' }
    ],
    USER_TYPES: {
        SELLER: 'SELLER',
        TESTER: 'TESTER'
    }
}