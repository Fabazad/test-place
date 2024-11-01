process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { createSingletonGetter } from "@/utils/singleton.js";
import { getAmazonProductDetails } from "./paapiProductHelpers/index.js";
import { AmazonClient } from "./type.js";

const createAmazonClient = (): AmazonClient => {
  return {
    getAmazonProductDetails,
  };
};

export const getAmazonClient = createSingletonGetter(createAmazonClient);
