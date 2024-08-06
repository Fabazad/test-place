import { createSingletonGetter } from "../../utils/singleton.js";
import axios from "axios";
import cheerio from "cheerio";
import { getCategory } from "./productHelpers/getCategory.js";
import { getDescription } from "./productHelpers/getDescription.js";
import { getImages } from "./productHelpers/getImages.js";
import { getIsPrime } from "./productHelpers/getIsPrime.js";
import { getPrice } from "./productHelpers/getPrice.js";
import { getSeller } from "./productHelpers/getSeller.js";
import { getTitle } from "./productHelpers/getTitle.js";
const createScrapper = () => {
    return {
        getAmazonProductDetails: async ({ asin }) => {
            const url = `https://www.amazon.fr/dp/${asin}`;
            const test = await axios.get(url);
            const $ = cheerio.load(test.data);
            const scrapRes = {
                title: getTitle($),
                price: getPrice($),
                description: getDescription($),
                isPrime: getIsPrime($),
                category: getCategory($),
                seller: getSeller($),
                imageUrls: getImages($),
            };
            return { success: true, data: scrapRes };
        },
    };
};
export const getScrapper = createSingletonGetter(createScrapper);
