import { CustomResponse } from "@/utils/CustomResponse.js";

export type Scrapper = {
  getAmazonProductDetails: (params: { asin: string }) => Promise<
    CustomResponse<
      {
        title?: string;
        price: number;
        description?: string;
        isPrime: boolean;
        category?: string;
        seller?: {
          name: string;
          url: string;
        };
        imageUrls: Array<string>;
      },
      "product_not_found" | "unknown_error"
    >
  >;
};
