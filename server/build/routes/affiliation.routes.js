
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2c35cad3-0a0c-5a3f-88c3-bcacbc65c785")}catch(e){}}();
import { AffiliationController } from "../controllers/affiliation.controller.js";
import { withAuth } from "../middlewares/withAuth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleResponseForRoute } from "../utils/CustomResponse.js";
import { zodValidationForRoute } from "../utils/zodValidationForRoute.js";
import express from "express";
import { z } from "zod";
export const affiliationRouter = express.Router();
affiliationRouter.get("/affiliated", withAuth(), async (request, reply) => {
    const { page, itemsPerPage } = zodValidationForRoute(request.query, z.object({
        page: z.coerce.number().min(1).default(1),
        itemsPerPage: z.coerce.number().min(1).max(100).default(10),
    }));
    const { userId } = request.decoded;
    const res = await AffiliationController.getUserAffiliated({
        userId,
        page,
        itemsPerPage,
    });
    reply.send(handleResponseForRoute(res));
});
affiliationRouter.get("/lastRecords", withAuth(), asyncHandler(async (request, reply) => {
    const { page, itemsPerPage } = zodValidationForRoute(request.query, z.object({
        page: z.coerce.number().min(1).default(1),
        itemsPerPage: z.coerce.number().min(1).max(100).default(10),
    }));
    const { userId } = request.decoded;
    const res = await AffiliationController.getLastAffiliationRecords({
        page,
        itemsPerPage,
        userId,
    });
    reply.send(handleResponseForRoute(res));
}));
affiliationRouter.get("/affiliationSummary", withAuth(), asyncHandler(async (request, reply) => {
    const { userId } = request.decoded;
    const res = await AffiliationController.getUserAffiliationSummary({ userId });
    reply.send(handleResponseForRoute(res));
}));
//# sourceMappingURL=affiliation.routes.js.map
//# debugId=2c35cad3-0a0c-5a3f-88c3-bcacbc65c785
