import { configs } from "@/configs.js";
import { ProductController } from "@/controllers/product.controller.js";
import { TestController } from "@/controllers/test.controller.js";
import { getMonitoringClient } from "@/libs/MonitoringClient/index.js";
import { getDatabaseConnection } from "databaseConnection/index.js";
import dayjs from "dayjs";

const dailyJob = async () => {
  const monitoringClient = getMonitoringClient();
  const databaseConnection = getDatabaseConnection();

  try {
    await databaseConnection.connect();

    if (dayjs().day() === 0) {
      await ProductController.emailLastPublishedProducts({
        frontendUrl: configs.FRONTEND_URL,
        lastPublishedProductsPeriodInDays: configs.LAST_PUBLISHED_PRODUCTS_PERIOD_IN_DAYS,
        productsLimit: configs.PRODUCTS_LIMIT_ON_LAST_PUBLISHED,
      });
    }

    await TestController.checkPendingTests({
      cancelPendingDays: configs.CANCEL_PENDING_DAYS,
      notificationPendingDays: configs.NOTIFICATION_PENDING_DAYS,
      frontendUrl: configs.FRONTEND_URL,
    });

    await databaseConnection.disconnect();
  } catch (err: any) {
    monitoringClient.sendEvent({
      level: "error",
      eventName: "email_last_published_products",
      data: {
        message: err.message,
      },
    });
    console.error(err);
  }

  process.exit(0);
};

dailyJob();
