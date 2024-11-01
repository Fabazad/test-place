
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="5fd01e51-7244-5185-b834-86cfa5a621f6")}catch(e){}}();
import axios from "axios";
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
    const result = await axios.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
            "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            Referer: "https://www.amazon.fr/",
            "Upgrade-Insecure-Requests": "1",
        },
    });
    const $ = cheerio.load(result.data);
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
//# debugId=5fd01e51-7244-5185-b834-86cfa5a621f6
