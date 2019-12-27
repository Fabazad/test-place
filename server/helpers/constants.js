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
        REVIEWER: "reviewer",
        SELLER: "seller"
    },
    PRODUCT_CATEGORIES: [
        { text: 'Electronique', value: 'electronic' },
        { text: 'Ameublement', value: 'house-furniture' },
        { text: 'Alexa Skils', value: 'alexa-skils' },
        { text: 'Amazon Pantry', value: 'amazon-pantry' },
        { text: 'Amazon Warehouse', value: 'amazon-warehouse' },
        { text: 'Animalerie', value: 'pet-shop' },
        { text: 'Apareils Amazon', value: 'amazon-device' },
        { text: 'Applis & Jeux', value: 'applis-game' },
        { text: 'Auto & Moto', value: 'auto-moto' },
        { text: 'Bagages', value: 'baggage' },
        { text: 'Beauté & Parfum', value: 'beauty-perfume' },
        { text: 'Beauté Prestige', value: 'beauty-prestiges' },
        { text: 'Bijoux', value: 'jewelry' },
        { text: 'Bricolage', value: 'housing' },
        { text: 'Bébé & Puériculture', value: 'baby' },
        { text: 'Chaussures & Sacs', value: 'shoes-bags' },
        { text: 'Cuisine & Maison', value: 'kitchen-house' },
        { text: 'DVD & Blueray', value: 'dvd' },
        { text: 'Epicerie', value: 'grocery' },
        { text: 'Fournitures de bureau', value: 'office-supplies' },
        { text: 'Gros électroménager', value: 'appliances' },
        { text: 'Handmade', value: 'handmade' },
        { text: 'High-Tech', value: 'high-tech' },
        { text: 'Higiène & Santé', value: 'higiene-health' },
        { text: 'Informatique', value: 'computeur-science' },
        { text: 'Instrument & Musique', value: 'music' },
        { text: 'Jardin', value: 'garden' },
        { text: 'Jeux & Jouet', value: 'games' },
        { text: 'Jeux vidéo', value: 'video-games' },
        { text: 'Livres', value: 'book' },
        { text: 'Logiciels', value: 'logiciels' },
        { text: 'Luminaires & Eclairages', value: 'lights' },
        { text: 'Mode', value: 'mode' },
        { text: 'Montres', value: 'watch' },
        { text: 'Sports & Loisirs', value: 'sports' },
        { text: 'Vetements & Accessoires', value: 'cloths' },
    ]
};

module.exports = constants;