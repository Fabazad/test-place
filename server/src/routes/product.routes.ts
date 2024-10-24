import {
  productSearchDataSchema,
  productUpdateDataSchema,
} from "@/entities/Product/product.constants.js";
import { productDataSchema } from "@/entities/Product/product.entity.js";
import { withAuth } from "@/middlewares/withAuth.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { Role } from "@/utils/constants.js";
import { handleResponseForRoute } from "@/utils/CustomResponse.js";
import {
  BadRequestError,
  NotFoundRequestError,
  ServerRequestError,
  UnauthorizedRequestError,
} from "@/utils/exceptions/index.js";
import { zodValidationForRoute } from "@/utils/zodValidationForRoute.js";
import express from "express";
import z from "zod";
import { ProductController } from "../controllers/product.controller.js";

const router = express.Router();

router.get(
  "/srapFromAsin/:asin",
  withAuth(Role.SELLER),
  asyncHandler(async (request, reply) => {
    const { asin } = zodValidationForRoute(
      request.params,
      z.object({
        asin: z.string(),
      })
    );

    const { amazonMerchantId } = zodValidationForRoute(
      request.query,
      z.object({
        amazonMerchantId: z.string().optional(),
      })
    );

    const res = await ProductController.scrapFromAsin({ asin, amazonMerchantId });

    reply.send(
      handleResponseForRoute(res, {
        already_product_with_asin: new BadRequestError("already_product_with_asin"),
        product_not_found: new NotFoundRequestError("product_not_found"),
        unknown_error: new ServerRequestError("unknown_error"),
      })
    );
  })
);

router.post(
  "/create",
  withAuth(Role.SELLER),
  asyncHandler(async (request, reply) => {
    const userId = request.decoded!.userId;
    const { item } = zodValidationForRoute(
      request.body,
      z.object({
        item: productDataSchema.omit({ seller: true, remainingTestsCount: true }),
      })
    );
    const res = await ProductController.create({ productData: item, userId });
    reply.send(
      handleResponseForRoute(res, {
        duplicate_asin: new UnauthorizedRequestError("duplicate_asin"),
      })
    );
  })
);

router.get(
  "/find",
  asyncHandler(async (request, reply) => {
    const { searchData: parsedSearchData } = zodValidationForRoute(
      request.query,
      z.object({
        searchData: productSearchDataSchema,
      })
    );
    const res = await ProductController.findPageResults({
      searchData: parsedSearchData,
    });

    reply.send(handleResponseForRoute(res));
  })
);

router.get(
  "/categories",
  asyncHandler(async (request, reply) => {
    const res = await ProductController.getCategories();
    reply.send(
      handleResponseForRoute(res, {
        missing_categories: new NotFoundRequestError("missing_categories"),
      })
    );
  })
);

router.get(
  "/:productId",
  asyncHandler(async (request, reply) => {
    const { productId } = zodValidationForRoute(
      request.params,
      z.object({ productId: z.string() })
    );
    const res = await ProductController.getOne({ productId });
    reply.send(
      handleResponseForRoute(res, {
        not_found: new NotFoundRequestError("not_found"),
      })
    );
  })
);

router.post(
  "/update",
  withAuth(Role.SELLER),
  asyncHandler(async (request, reply) => {
    const user = request.decoded!;
    const { itemId, fields, published } = zodValidationForRoute(
      request.body,
      z.object({
        itemId: z.string(),
        published: z.boolean().optional(),
        fields: productUpdateDataSchema.optional(),
      })
    );
    const res = await ProductController.update({
      productId: itemId,
      published,
      fields,
      user,
    });
    reply.send(
      handleResponseForRoute(res, {
        not_found: new NotFoundRequestError("not_found"),
        not_allowed: new UnauthorizedRequestError("not_allowed"),
        not_found_when_updating: new NotFoundRequestError("not_found_when_updating"),
      })
    );
  })
);

router.delete(
  "/:productId",
  withAuth(Role.SELLER),
  asyncHandler(async (request, reply) => {
    const { userId } = request.decoded!;
    const { productId } = zodValidationForRoute(
      request.params,
      z.object({ productId: z.string() })
    );
    const res = await ProductController.delete({ productId, userId });
    reply.send(
      handleResponseForRoute(res, {
        not_found: new NotFoundRequestError("not_found"),
        not_allowed: new UnauthorizedRequestError("not_allowed"),
        not_found_when_deleting: new NotFoundRequestError("not_found_when_deleting"),
      })
    );
  })
);

export default router;
