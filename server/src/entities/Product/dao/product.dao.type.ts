import { CustomResponse } from "@/utils/CustomResponse";
import { ProductSearchData } from "../product.constants";
import { PopulatedProduct, Product, ProductData } from "../product.entity";

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
};
