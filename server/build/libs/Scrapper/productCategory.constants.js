const PRODUCT_CATEGORIES_RECORD = {
    "auto-moto": "Auto et Moto",
    "beauty-perfume": "Beauté et Parfum",
    "computeur-science": "Informatique",
    "high-tech": "High-Tech",
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
