import { CustomResponse } from "@/utils/CustomResponse.js";

export type AmazonClient = {
  getAmazonProductDetails: (params: {
    asin: string;
    amazonMerchantId?: string;
  }) => Promise<
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
      "product_not_found" | "unknown_error" | "missing_data"
    >
  >;
};
