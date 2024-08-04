import { createSingletonGetter } from "@/utils/singleton.js";
import Crawler from "crawler";
import { getCategory } from "./productHelpers/getCategory.js";
import { getDescription } from "./productHelpers/getDescription.js";
import { getImages } from "./productHelpers/getImages.js";
import { getIsPrime } from "./productHelpers/getIsPrime.js";
import { getPrice } from "./productHelpers/getPrice.js";
import { getSeller } from "./productHelpers/getSeller.js";
import { getTitle } from "./productHelpers/getTitle.js";
import { Scrapper } from "./type.js";

const createScrapper = (): Scrapper => {
  return {
    getAmazonProductDetails: async ({ asin }) => {
      const url = `https://www.amazon.fr/dp/${asin}`;

      const maxTest = 2;
      let currentTest = 1;

      const promise = new Promise<
        Awaited<ReturnType<Scrapper["getAmazonProductDetails"]>>
      >((resolve) => {
        let c = new Crawler({
          maxConnections: 10,
          // This will be called for each crawled page
          callback: (error, res) => {
            let $ = res.$;
            if (error) {
              return resolve({
                success: false,
                errorCode: "unknown_error",
                errorMessage: error.message,
              });
            }
            if (res.statusCode === 404) {
              return resolve({ success: false, errorCode: "product_not_found" });
            }
            const scrapRes = {
              title: getTitle($),
              price: getPrice($),
              description: getDescription($),
              isPrime: getIsPrime($),
              category: getCategory($),
              seller: getSeller($),
              imageUrls: getImages($),
            };

            if (!scrapRes.description && currentTest < maxTest) {
              currentTest++;
              c.queue(url);
            } else {
              resolve({ success: true, data: scrapRes });
            }
          },
        });

        c.queue(url);
      });

      const res = await promise;
      return res;
    },
  };
};

export const getScrapper = createSingletonGetter(createScrapper);
