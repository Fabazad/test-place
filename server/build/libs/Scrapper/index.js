
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c1248706-aa1f-5ecb-b9a9-acac306b2548")}catch(e){}}();
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
            const test = await axios.get(url, {
                headers: {
                    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                    Accept: "*/*",
                },
            });
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
//# sourceMappingURL=index.js.map
//# debugId=c1248706-aa1f-5ecb-b9a9-acac306b2548
