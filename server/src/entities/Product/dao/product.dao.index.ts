import { generateMongooseSchemaFromZod } from "@/utils/generateMongooseSchemaFromZod/index.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import mongoose, { FilterQuery } from "mongoose";
import { generateAmazonUrl, ProductSortBy } from "../product.constants.js";
import {
  PopulatedProduct,
  Product,
  ProductData,
  productDataSchema,
} from "../product.entity.js";
import { ProductDAO } from "./product.dao.type.js";

const productMongooseSchema = new mongoose.Schema(
  generateMongooseSchemaFromZod(productDataSchema),
  { timestamps: true }
);

productMongooseSchema.index({ title: "text" }).index({ asin: 1 }, { unique: true });

const productModel = mongoose.model<Product>("Product", productMongooseSchema);

const createProductDAO = (): ProductDAO => {
  const SORT_RECORD: Record<ProductSortBy, { [key: string]: any }> = {
    [ProductSortBy.CREATED_AT]: { createdAt: -1 },
    [ProductSortBy.PRICE]: { price: 1 },
    [ProductSortBy.FINAL_PRICE]: { finalPrice: 1 },
    [ProductSortBy.SCORE]: { score: { $meta: "textScore" } },
  };
  return {
    getProductById: async ({ id }) => {
      const product = await productModel.findById(id).lean();
      if (!product) return null;
      product.amazonUrl = generateAmazonUrl(product);
      return JSON.parse(JSON.stringify(product));
    },
    decrementRemainingTestsCount: async ({ productId }) => {
      await productModel.updateOne(
        { _id: productId },
        { $inc: { remainingTestsCount: -1 } }
      );
    },
    getProductByAsin: async ({ asin }) => {
      const product = await productModel.findOne({ asin }).lean();
      if (!product) return null;
      product.amazonUrl = generateAmazonUrl(product);
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
          .skip(itemsPerPage * (page - 1))
          .populate("seller")
          .lean<Array<PopulatedProduct>>(),
        productModel.countDocuments(query),
      ]);

      return {
        hits: hits.map((h) => {
          h._id = h._id.toString();
          h.seller._id = h.seller._id.toString();
          //@ts-ignore
          delete h.seller.password;
          //@ts-ignore
          h.amazonUrl = generateAmazonUrl(h);
          return h;
        }),
        totalCount,
      };
    },
    getPopulatedProductById: async ({ id }) => {
      const product = await productModel.findById(id).populate("seller").lean();
      if (!product) return null;
      const res = JSON.parse(JSON.stringify(product));
      delete res.seller.password;
      res.amazonUrl = generateAmazonUrl(res);
      return res;
    },
    updateProduct: async ({ id, updates }) => {
      const product = await productModel.findByIdAndUpdate(id, updates, { new: true });
      if (!product) return null;
      const res = JSON.parse(JSON.stringify(product));
      delete res.seller.password;
      res.amazonUrl = generateAmazonUrl(res);
      return res;
    },
    create: async ({ productData }) => {
      try {
        const product = await productModel.create(productData);
        const res = JSON.parse(JSON.stringify(product.toJSON()));
        delete res.seller.password;
        res.amazonUrl = generateAmazonUrl(res);
        return { success: true, data: res };
      } catch (err: any) {
        if (err.code === 11000) {
          return { success: false, errorCode: "duplicate_asin" };
        }
        throw err;
      }
    },
    findAndDeleteProduct: async ({ id }) => {
      const product = await productModel.findByIdAndDelete(id).lean();
      if (!product) return null;
      const res = JSON.parse(JSON.stringify(product));
      delete res.seller.password;
      res.amazonUrl = generateAmazonUrl(res);
      return res;
    },
  };
};

export const getProductDAO = createSingletonGetter(createProductDAO);
