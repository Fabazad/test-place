
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f5e53f1c-4c9b-583b-bf0a-4a34fc3d3cb0")}catch(e){}}();
import { configs } from "../configs.js";
import { ProductController } from "../controllers/product.controller.js";
import { getMonitoringClient } from "../libs/MonitoringClient/index.js";
const emailLastPublishedProducts = async () => {
    const monitoringClient = getMonitoringClient();
    try {
        const res = await ProductController.emailLastPublishedProducts({
            frontendUrl: configs.FRONTEND_URL,
            lastPublishedProductsPeriodInDays: configs.LAST_PUBLISHED_PRODUCTS_PERIOD_IN_DAYS,
        });
        console.log("res: ", res.data);
    }
    catch (err) {
        console.log(err);
        monitoringClient.sendEvent({
            level: "error",
            eventName: "email_last_published_products",
            data: {
                message: err.message,
            },
        });
    }
};
emailLastPublishedProducts();
//# sourceMappingURL=emailLastPublishedProducts.cli.js.map
//# debugId=f5e53f1c-4c9b-583b-bf0a-4a34fc3d3cb0
