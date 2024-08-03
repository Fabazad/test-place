import { productSearchDataSchema } from "@/entities/Product/product.constants";
import { productDataSchema } from "@/entities/Product/product.entity";
import { decode } from "@/middlewares/decode";
import { withAuth } from "@/middlewares/withAuth";
import { Role } from "@/utils/constants";
import { handleResponseForRoute } from "@/utils/CustomResponse";
import {
  NotFoundRequestError,
  ServerRequestError,
  UnauthorizedRequestError,
} from "@/utils/exceptions";
import { zodValidationForRoute } from "@/utils/zodValidationForRoute";
import express from "express";
import z from "zod";
import { ProductController } from "../controllers/product.controller";

const router = express.Router();

router.get("/srapFromAsin/:asin", withAuth(Role.SELLER), async (request, reply) => {
  const { asin } = zodValidationForRoute(
    request.params,
    z.object({
      asin: z.string(),
    })
  );
  const res = await ProductController.scrapFromAsin({ asin });

  reply.send(
    handleResponseForRoute(res, {
      already_product_with_asin: new UnauthorizedRequestError(
        "already_product_with_asin"
      ),
      product_not_found: new NotFoundRequestError("product_not_found"),
      unknown_error: new ServerRequestError("unknown_error"),
    })
  );
});

router.post("/create", withAuth(Role.SELLER), async (request, reply) => {
  const userId = request.decoded?.userId;
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
});

router.get("/find", decode, async (request, reply) => {
  const userId = request.decoded?.userId;
  const { searchData } = zodValidationForRoute(
    request.query,
    z.object({
      searchData: z.string(),
    })
  );
  const parsedSearchData = zodValidationForRoute(
    JSON.parse(searchData),
    productSearchDataSchema
  );
  const res = await ProductController.findPageResults({
    userId,
    searchData: parsedSearchData,
  });

  reply.send(handleResponseForRoute(res));
});

router.get("/categories", async (request, reply) => {
  ProductController.getCategories()
    .then((res) => reply.status(200).send(res))
    .catch((err) => reply.status(err.status).send(err.message));
});

router.get("/:productId", async (request, reply) => {
  const { productId } = request.params;
  ProductController.getOne(productId)
    .then((res) => reply.status(200).send(res))
    .catch((err) => reply.status(err.status).send(err.message));
});

router.post("/update", withAuth(Role.SELLER), async (request, reply) => {
  const { itemId, fields } = request.body;
  ProductController.update(itemId, fields, request.decoded)
    .then((res) => reply.status(200).send(res))
    .catch((err) => reply.status(err.status).send(err.message));
});

router.delete("/:productId", withAuth(Role.SELLER), async (request, reply) => {
  const { productId } = request.params;
  ProductController.delete(productId, request.decoded.userId)
    .then((res) => reply.status(200).send(res))
    .catch((err) => reply.status(err.status).send(err.message));
});

module.exports = router;
