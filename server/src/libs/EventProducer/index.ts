import { configs } from "@/configs.js";
import { Product } from "@/entities/Product/product.entity.js";
import { CustomResponse } from "@/utils/CustomResponse.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import axios from "axios";

export const getEventProducer = createSingletonGetter(() => {
  const webflowAxios = axios.create({
    baseURL: "https://api.webflow.com/v2",
    headers: {
      Authorization: `Bearer ${configs.WEBFLOW_API_KEY}`,
      "Content-Type": "application/json",
      "accept-version": "1.0.0",
    },
  });
  const amazonArticlesWebflowCollectionId = configs.AMAZON_ARTICLES_WEBFLOW_COLLECTION_ID;

  return {
    sendProductPublished: async (
      product: Pick<Product, "title" | "amazonUrl" | "price" | "imageUrls">
    ): Promise<CustomResponse<undefined, "unknown_error">> => {
      const slug = product.title
        .toLowerCase()
        .replace(/\s+|,|'|\+/g, "-")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/-+/g, "-")
        .slice(0, 100);

      const data = {
        isArchived: false,
        isDraft: false,
        fieldData: {
          name: product.title, // Nom du produit
          slug, // Slug unique
          url: product.amazonUrl,
          image: product.imageUrls[0], // Lien de l'image du produit
          "price-2": product.price, // Prix du produit
        },
      };

      try {
        await webflowAxios.post(
          `/collections/${amazonArticlesWebflowCollectionId}/items`,
          data
        );
        return { success: true, data: undefined };
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          return {
            success: false,
            errorCode: "unknown_error",
            errorMessage: `${error.message} - ${JSON.stringify(error.response?.data)}`,
          };
        }
        return {
          success: false,
          errorCode: "unknown_error",
          errorMessage: error.message,
        };
      }
    },
  };
});
