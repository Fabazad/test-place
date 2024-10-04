
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f180b9f2-5be0-5052-ae36-106ceeea13b3")}catch(e){}}();
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
        getAmazonProductDetails: async ({ asin }) => {
            const url = `https://www.amazon.fr/dp/${asin}`;
            var session_id = (1000000 * Math.random()) | 0;
            const test = await axios.default.get(url, {
                headers: {},
                proxy: {
                    host: "brd.superproxy.io",
                    port: 22225,
                    auth: {
                        username: "brd-customer-hl_19852198-zone-datacenter_proxy1" +
                            "-country-fr-session-" +
                            session_id,
                        password: "gp6ycnmv2g6k",
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
//# debugId=f180b9f2-5be0-5052-ae36-106ceeea13b3
