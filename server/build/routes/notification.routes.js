
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7dbe547d-8dcd-58e9-ba28-993884d67a42")}catch(e){}}();
import { NotificationController } from "../controllers/notification.controller.js";
import { withAuth } from "../middlewares/withAuth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleResponseForRoute } from "../utils/CustomResponse.js";
import { zodValidationForRoute } from "../utils/zodValidationForRoute.js";
import { Router } from "express";
import z from "zod";
const router = Router();
router.get("/user-notifications", withAuth(), asyncHandler(async (request, reply) => {
    const userId = request.decoded.userId;
    const res = await NotificationController.getUserNotifications(userId);
    reply.send(handleResponseForRoute(res));
}));
router.post("/set-notifications-viewed", withAuth(), asyncHandler(async (request, reply) => {
    const { notificationsIds } = zodValidationForRoute(request.body, z.object({ notificationsIds: z.array(z.string()).min(1) }));
    const userId = request.decoded.userId;
    const res = await NotificationController.setNotificationsViewed(userId, notificationsIds);
    reply.send(handleResponseForRoute(res));
}));
export default router;
//# sourceMappingURL=notification.routes.js.map
//# debugId=7dbe547d-8dcd-58e9-ba28-993884d67a42
