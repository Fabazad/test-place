
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c9e8a310-f13d-5465-b5ff-58a7cbb5d73a")}catch(e){}}();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { configs } from "../../configs.js";
import { createSingletonGetter } from "../../utils/singleton.js";
import axios from "axios-https-proxy-fix";
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
        getAmazonProductDetails: async ({ asin, amazonMerchantId }) => {
            const url = `https://www.amazon.fr/dp/${asin}${amazonMerchantId ? `?m=${amazonMerchantId}` : ""}`;
            const test = await axios.default.get(url, {
                proxy: {
                    host: configs.PROXY_HOST,
                    port: configs.PROXY_PORT,
                    auth: {
                        username: configs.PROXY_USERNAME,
                        password: configs.PROXY_PASSWORD,
                    },
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
//# debugId=c9e8a310-f13d-5465-b5ff-58a7cbb5d73a
