import { configs } from "@/configs";
import { getProductDAO } from "@/entities/Product/dao/product.dao.index";
import { ProductSearchData } from "@/entities/Product/product.constants";
import {
  PopulatedProduct,
  Product,
  ProductData,
} from "@/entities/Product/product.entity";
import { getScrapper } from "@/libs/Scrapper";
import { CustomResponse } from "@/utils/CustomResponse";
import dayjs from "dayjs";

const constants = require("../helpers/constants");
const ProductModel = require("../models/product.model");
const UserModel = require("../models/user.model");
const ErrorResponses = require("../helpers/ErrorResponses");
const { ROLES, VALID_TEST_STATUSES } = constants;

export class ProductController {
  static async scrapFromAsin(params: { asin: string }): Promise<
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
      "already_product_with_asin" | "product_not_found" | "unknown_error"
    >
  > {
    const { asin } = params;

    const productDAO = getProductDAO();
    const scrapper = getScrapper();

    const product = await productDAO.getProductByAsin({ asin });

    if (product)
      return {
        success: false,
        errorCode: "already_product_with_asin",
        errorMessage: product._id,
      };

    const scrappedData = await scrapper.getAmazonProductDetails({ asin });

    return scrappedData;
  }

  static async create(params: {
    productData: Omit<ProductData, "seller" | "remainingTestsCount">;
    userId: string;
  }): Promise<CustomResponse<Product, "duplicate_asin">> {
    const { productData, userId } = params;

    const productDAO = getProductDAO();

    const creationRes = await productDAO.create({
      productData: {
        ...productData,
        seller: userId,
        publishDate: new Date(),
        publishExpirationDate: dayjs()
          .add(configs.PUBLICATION_TIME_IN_DAYS, "d")
          .toDate(),
        remainingTestsCount: productData.maxDemands,
      },
    });
    if (!creationRes.success) return creationRes;

    return { success: true, data: creationRes.data };
  }

  static async findPageResults(params: {
    userId?: string;
    searchData: ProductSearchData;
  }): Promise<CustomResponse<{ hits: Array<PopulatedProduct>; totalCount: number }>> {
    const { userId, searchData } = params;
    const productDAO = getProductDAO();

    const queryRes = await productDAO.findPageResults({
      searchData: { ...searchData, ...(userId && { seller: userId }) },
    });

    return { success: true, data: queryRes };
  }

  static async getCategories() {
    return new Promise((resolve, reject) => {
      const categories = constants.PRODUCT_CATEGORIES;
      if (categories && categories.length > 0) {
        resolve(categories);
      } else {
        reject({ status: 500, message: "Missing categories." });
      }
    });
  }

  static async getOne(productId, userId) {
    return new Promise((resolve, reject) => {
      if (!ObjectId.isValid(productId)) {
        return reject({ status: 400, message: "Not a product id" });
      }
      ProductModel.findById(productId)
        .populate("seller")
        .then((product) => {
          if (product) {
            const seller = {
              createdAt: product.seller.createdAt,
              email: product.seller.email,
              gender: product.seller.gender,
              name: product.seller.name,
              roles: product.seller.roles,
              sellerMessage: product.seller.sellerMessage,
              _id: product.seller._id,
              isCertified: product.seller.isCertified,
            };
            product.seller = seller;
            resolve(product);
          } else return reject({ status: 404, message: "Couldn't find product" });
        })
        .catch((err) => reject(ErrorResponses.mongoose(err)));
    });
  }

  static async update(productId, fields, user) {
    return new Promise((resolve, reject) => {
      ProductModel.findById(productId)
        .then((product) => {
          if (
            product.seller.toString() !== user.userId &&
            !user.roles.includes(ROLES.ADMIN)
          ) {
            return reject({
              status: 400,
              message: "You're not the seller of this product.",
            });
          }

          if (fields.published || fields.publishExpirationDate) {
            fields.publishExpirationDate = new Date().setMonth(new Date().getMonth() + 1);
            delete fields.published;
          }
          if (fields.published === false) {
            fields.publishExpirationDate = null;
            delete fields.published;
          }

          ProductModel.findByIdAndUpdate(productId, fields)
            .then(resolve)
            .catch((err) => reject(ErrorResponses.mongoose(err)));
        })
        .catch((err) => reject(ErrorResponses.mongoose(err)));
    });
  }

  static async delete(productId, userId) {
    return new Promise(async (resolve, reject) => {
      const product = await ProductModel.findById(productId);

      if (!product) {
        return reject({ status: 400, message: "Wrong product id" });
      }

      if (product.seller.toString() !== userId) {
        return reject({ status: 401, message: "Unauthorized" });
      }

      ProductModel.findByIdAndDelete(productId)
        .then(resolve)
        .catch((err) => reject(ErrorResponses.mongoose(err)));
    });
  }
}
