
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e9e5e845-f4f7-5285-93ac-920a3c9f91b7")}catch(e){}}();
const PRODUCT_CATEGORIES_RECORD = {
    "auto-moto": "Auto et Moto",
    "beauty-perfume": "Beauté et Parfum",
    "computeur-science": "Informatique",
    electronics: "High-Tech",
    "higiene-health": "Hygiène et Santé",
    "kitchen-house": "Cuisine & Maison",
    "office-supplies": "Fournitures de bureau",
    "pet-shop": "Animalerie",
    "shoes-bags": "Chaussures et Sacs",
    "video-games": "Jeux vidéo",
    appliances: "Gros électroménager",
    baby: "Bébés & Puériculture",
    baggage: "Bagages",
    cloths: "Vêtements et accessoires",
    games: "Jeux et Jouets",
    garden: "Jardin",
    grocery: "Epicerie",
    housing: "Bricolage",
    jewelry: "Bijoux",
    lights: "Luminaires et Eclairage",
    mode: "Mode",
    music: "Instruments de Musique et Sono",
    watch: "Montres",
    sports: "Sports et Loisirs",
};
export const PRODUCT_CATEGORIES_MAP = Object.entries(PRODUCT_CATEGORIES_RECORD).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {});
//# sourceMappingURL=productCategory.constants.js.map
//# debugId=e9e5e845-f4f7-5285-93ac-920a3c9f91b7
