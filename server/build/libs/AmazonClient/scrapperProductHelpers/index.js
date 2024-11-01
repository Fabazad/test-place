
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="32cd9401-ba88-5bab-9d03-c60e38a498cc")}catch(e){}}();
import { configs } from "../../../configs.js";
import axios from "axios-https-proxy-fix";
import cheerio from "cheerio";
import { getCategory } from "./getCategory.js";
import { getDescription } from "./getDescription.js";
import { getImages } from "./getImages.js";
import { getIsPrime } from "./getIsPrime.js";
import { getPrice } from "./getPrice.js";
import { getSeller } from "./getSeller.js";
import { getTitle } from "./getTitle.js";
export const getAmazonProductDetails = async ({ asin, amazonMerchantId, }) => {
    const url = `https://www.amazon.fr/dp/${asin}${amazonMerchantId ? `?m=${amazonMerchantId}` : ""}`;
    const request = await axios.default.get(url, {
        proxy: {
            host: configs.PROXY_HOST,
            port: configs.PROXY_PORT,
            auth: {
                username: configs.PROXY_USERNAME,
                password: configs.PROXY_PASSWORD,
            },
        },
    });
    const $ = cheerio.load(request.data);
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
};
//# sourceMappingURL=index.js.map
//# debugId=32cd9401-ba88-5bab-9d03-c60e38a498cc
