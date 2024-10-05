
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="447efda7-6091-5258-ba92-bf627530a042")}catch(e){}}();
import { configs } from "../configs.js";
import { ProductController } from "../controllers/product.controller.js";
import { getMonitoringClient } from "../libs/MonitoringClient/index.js";
const emailLastPublishedProducts = async () => {
    const monitoringClient = getMonitoringClient();
    console.log("Yeaaah");
    try {
        const res = await ProductController.emailLastPublishedProducts({
            frontendUrl: configs.FRONTEND_URL,
            lastPublishedProductsPeriodInDays: configs.LAST_PUBLISHED_PRODUCTS_PERIOD_IN_DAYS,
        });
        console.log(res.data);
    }
    catch (err) {
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
//# sourceMappingURL=emailLastPublishedProducts.cli.js.map
//# debugId=447efda7-6091-5258-ba92-bf627530a042
