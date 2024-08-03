import { generateMongooseSchemaFromZod } from "@/utils/generateMongooseSchemaFromZod";
import { createSingletonGetter } from "@/utils/singleton";
import mongoose, { FilterQuery } from "mongoose";
import mongoosePaginate from "mongoose-aggregate-paginate-v2";
import { ProductSortBy } from "../product.constants";
import { ProductData, productDataSchema } from "../product.entity";
import { ProductDAO } from "./product.dao.type";

const createProductDAO = (): ProductDAO => {
  const productMongooseSchema = new mongoose.Schema(
    generateMongooseSchemaFromZod(productDataSchema),
    { timestamps: true }
  );

  productMongooseSchema.index({ title: "text" }).index({ asin: 1 }, { unique: true });

  productMongooseSchema.plugin(mongoosePaginate);

  const productModel = mongoose.model<ProductData>("Product", productMongooseSchema);

  const SORT_RECORD: Record<ProductSortBy, { [key: string]: any }> = {
    [ProductSortBy.CREATED_AT]: { createdAt: -1 },
    [ProductSortBy.PRICE]: { price: 1 },
    [ProductSortBy.FINAL_PRICE]: { finalPrice: 1 },
    [ProductSortBy.SCORE]: { score: { $meta: "textScore" } },
  };
  return {
    getProductById: async ({ id }) => {
      const product = await productModel.findById(id);
      if (!product) return null;
      return JSON.parse(JSON.stringify(product));
    },
    decrementRemainingTestsCount: async ({ productId }) => {
      await productModel.updateOne(
        { _id: productId },
        { $dec: { remainingTestsCount: 1 } }
      );
    },
    getProductByAsin: async ({ asin }) => {
      const product = await productModel.findOne({ asin });
      if (!product) return null;
      return JSON.parse(JSON.stringify(product));
    },
    findPageResults: async ({ searchData }) => {
      const {
        itemsPerPage,
        page,
        published,
        sortBy,
        keyWords,
        automaticAcceptance,
        category,
        free,
        maxPrice,
        minPrice,
        prime,
        seller,
        remainingRequests,
      } = searchData;
      const query: FilterQuery<ProductData> = {
        ...(published && { publishExpirationDate: { $gte: new Date() } }),
        ...(keyWords && { $text: { $search: keyWords.toLowerCase() } }),
        ...(automaticAcceptance && { automaticAcceptance }),
        ...(category && { category }),
        ...(free && { finalPrice: 0 }),
        ...(minPrice === undefined &&
          maxPrice !== undefined && { price: { $lte: maxPrice } }),
        ...(minPrice !== undefined &&
          maxPrice === undefined && { price: { $gte: minPrice } }),
        ...(maxPrice !== undefined &&
          minPrice !== undefined && { price: { $gte: minPrice, $lte: maxPrice } }),
        ...(prime && { isPrime: true }),
        ...(seller && { seller }),
        ...(remainingRequests && { remainingTestsCount: { $gt: 0 } }),
      };

      const [hits, totalCount] = await Promise.all([
        productModel
          .find(query)
          .sort(
            !keyWords && sortBy === ProductSortBy.SCORE
              ? { createdAt: -1 }
              : SORT_RECORD[sortBy]
          )
          .limit(itemsPerPage)
          .skip(itemsPerPage * page - 1)
          .populate("seller"),
        productModel.countDocuments(query),
      ]);

      return { hits: JSON.parse(JSON.stringify(hits)), totalCount };
    },
  };
};

export const getProductDAO = createSingletonGetter(createProductDAO);
