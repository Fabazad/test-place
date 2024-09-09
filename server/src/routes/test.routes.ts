import { TestController } from "@/controllers/test.controller.js";
import { TestStatus } from "@/entities/Test/test.constants.js";
import { withAuth } from "@/middlewares/withAuth.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { Role, testStatusUpdateParamsSchema } from "@/utils/constants.js";
import { handleResponseForRoute } from "@/utils/CustomResponse.js";
import {
  BadRequestError,
  NotFoundRequestError,
  ServerRequestError,
  UnauthorizedRequestError,
} from "@/utils/exceptions/index.js";
import { booleanSchema, numberSchema } from "@/utils/zod.utils.js";
import { zodValidationForRoute } from "@/utils/zodValidationForRoute.js";
import { Router } from "express";
import z from "zod";

const router = Router();

router.post(
  "/create",
  withAuth(Role.TESTER),
  asyncHandler(async (request, reply) => {
    const { productId, status, testerMessage } = zodValidationForRoute(
      request.body,
      z.object({
        productId: z.string(),
        status: z.nativeEnum(TestStatus),
        testerMessage: z.string().optional(),
      })
    );
    const frontendUrl = zodValidationForRoute(request.headers.origin, z.string());

    const userId = request.decoded!.userId;
    const res = await TestController.create({
      userId,
      productId,
      status,
      testerMessage,
      frontendUrl,
    });
    reply.send(
      handleResponseForRoute(res, {
        dont_have_automatic_acceptance: new BadRequestError(
          "dont_have_automatic_acceptance"
        ),
        seller_not_found: new NotFoundRequestError("seller_not_found"),
        not_enough_remaining_requests: new BadRequestError(
          "not_enough_remaining_requests"
        ),
        user_is_seller: new BadRequestError("user_is_seller"),
        product_not_found: new NotFoundRequestError("product_not_found"),
        user_to_notify_not_found: new ServerRequestError("user_to_notify_not_found"),
        missing_tester_message: new BadRequestError("missing_tester_message"),
        already_testing: new BadRequestError("already_testing"),
        previous_request_declined: new BadRequestError("previous_request_declined"),
      })
    );
  })
);

router.get(
  "/statuses",
  asyncHandler(async (request, reply) => {
    const res = await TestController.getStatuses();
    reply.send(res);
  })
);

router.get(
  "/find",
  withAuth(),
  asyncHandler(async (request, reply) => {
    const userId = request.decoded!.userId;
    const { searchData } = zodValidationForRoute(
      request.query,
      z.object({
        searchData: z.object({
          itemsPerPage: numberSchema({ max: 100, min: 1 }),
          page: numberSchema({ min: 1 }),
          statuses: z.array(z.nativeEnum(TestStatus)).optional(),
          asSeller: booleanSchema().optional(),
          asTester: booleanSchema().optional(),
        }),
      })
    );
    const res = await TestController.find({ userId, searchData });

    reply.send(handleResponseForRoute(res));
  })
);

router.post(
  "/updateStatus",
  asyncHandler(async (request, reply) => {
    const userId = request.decoded!.userId;
    const { testId, update } = zodValidationForRoute(
      request.body,
      z.object({
        testId: z.string(),
        update: testStatusUpdateParamsSchema,
      })
    );

    const frontendUrl = zodValidationForRoute(request.headers.origin, z.string());

    const res = await TestController.updateStatus({
      userId,
      testId,
      update,
      frontendUrl,
    });

    reply.send(
      handleResponseForRoute(res, {
        test_not_found: new NotFoundRequestError("test_not_found"),
        test_not_found_when_updating: new NotFoundRequestError(
          "test_not_found_when_updating"
        ),
        only_allowed_for_seller: new UnauthorizedRequestError("only_allowed_for_seller"),
        only_allowed_for_tester: new UnauthorizedRequestError("only_allowed_for_tester"),
        wrong_previous_status: new BadRequestError("wrong_previous_status"),
        user_to_notify_not_found: new ServerRequestError("user_to_notify_not_found"),
      })
    );
  })
);

router.get(
  "/:testId",
  withAuth(),
  asyncHandler(async (request, reply) => {
    const { userId, roles } = request.decoded!;
    const { testId } = zodValidationForRoute(
      request.params,
      z.object({ testId: z.string() })
    );

    const res = await TestController.getTest({ testId, userId, roles });

    reply.send(
      handleResponseForRoute(res, {
        not_found: new NotFoundRequestError("not_found"),
        not_allowed: new UnauthorizedRequestError("not_allowed"),
      })
    );
  })
);

export default router;
