import { configs } from "@/configs.js";
import { ProductController } from "@/controllers/product.controller.js";
import { getMonitoringClient } from "@/libs/MonitoringClient/index.js";

const emailLastPublishedProducts = async () => {
  const monitoringClient = getMonitoringClient();
  console.log("Yeaaah");

  try {
    const res = await ProductController.emailLastPublishedProducts({
      frontendUrl: configs.FRONTEND_URL,
      lastPublishedProductsPeriodInDays: configs.LAST_PUBLISHED_PRODUCTS_PERIOD_IN_DAYS,
    });

    console.log(res.data);
  } catch (err: any) {
    monitoringClient.sendEvent({
      level: "error",
      eventName: "email_last_published_products",
      data: {
        message: `[${err.code}] ${err.message}`,
      },
    });
  }
};

emailLastPublishedProducts();
