import { configs } from "@/configs.js";
import { ProductController } from "@/controllers/product.controller.js";
import { getMonitoringClient } from "@/libs/MonitoringClient/index.js";
import { getDatabaseConnection } from "databaseConnection/index.js";
import dayjs from "dayjs";

const emailLastPublishedProducts = async () => {
  if (dayjs().day() !== 0) {
    console.log("This script should be run on Sunday");
    process.exit(0);
  }

  const monitoringClient = getMonitoringClient();
  const databaseConnection = getDatabaseConnection();

  try {
    await databaseConnection.connect();
    await ProductController.emailLastPublishedProducts({
      frontendUrl: configs.FRONTEND_URL,
      lastPublishedProductsPeriodInDays: configs.LAST_PUBLISHED_PRODUCTS_PERIOD_IN_DAYS,
      productsLimit: configs.PRODUCTS_LIMIT_ON_LAST_PUBLISHED,
    });
  } catch (err: any) {
    monitoringClient.sendEvent({
      level: "error",
      eventName: "email_last_published_products",
      data: {
        message: err.message,
      },
    });
  }

  await databaseConnection.disconnect();
  process.exit(0);
};

emailLastPublishedProducts();
