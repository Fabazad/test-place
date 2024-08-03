import { NotificationController } from "@/controllers/notification.controller";
import { withAuth } from "@/middlewares/withAuth";
import { handleResponseForRoute } from "@/utils/CustomResponse";
import { zodValidationForRoute } from "@/utils/zodValidationForRoute";
import { Router } from "express";
import z from "zod";

const router = Router();

router.get("/user-notifications", withAuth(), async (request, reply) => {
  const userId = request.decoded!.userId;
  const res = await NotificationController.getUserNotifications(userId);
  reply.send(handleResponseForRoute(res));
});

router.post("/set-notifications-viewed", withAuth(), async (request, reply) => {
  const { notificationsIds } = zodValidationForRoute(
    request.body,
    z.object({ notificationsIds: z.array(z.string()).min(1) })
  );
  const userId = request.decoded!.userId;

  const res = await NotificationController.setNotificationsViewed(
    userId,
    notificationsIds
  );
  reply.send(handleResponseForRoute(res));
});

module.exports = router;
