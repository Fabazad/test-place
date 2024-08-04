import { CustomResponse } from "@/utils/CustomResponse.js";
import { ProductSearchData, ProductUpdateData } from "../product.constants.js";
import { PopulatedProduct, Product, ProductData } from "../product.entity.js";

export type ProductDAO = {
  getProductById: (params: { id: string }) => Promise<Product | null>;
  decrementRemainingTestsCount: (params: { productId: string }) => Promise<void>;
  getProductByAsin: (params: { asin: string }) => Promise<Product | null>;
  create: (params: {
    productData: ProductData;
  }) => Promise<CustomResponse<Product, "duplicate_asin">>;
  findPageResults: (params: {
    searchData: ProductSearchData;
  }) => Promise<{ hits: Array<PopulatedProduct>; totalCount: number }>;
  getPopulatedProductById: (params: { id: string }) => Promise<PopulatedProduct | null>;
  updateProduct: (params: {
    id: string;
    updates: ProductUpdateData & Pick<Product, "publishExpirationDate">;
  }) => Promise<Product | null>;
  findAndDeleteProduct: (params: { id: string }) => Promise<Product | null>;
};
