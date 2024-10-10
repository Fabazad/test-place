
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c054e2f8-8657-5a88-80fb-474f97e021b7")}catch(e){}}();
import { configs } from "../configs.js";
import { ProductController } from "../controllers/product.controller.js";
import { getMonitoringClient } from "../libs/MonitoringClient/index.js";
import { getDatabaseConnection } from "../databaseConnection/index.js";
const emailLastPublishedProducts = async () => {
    const monitoringClient = getMonitoringClient();
    const databaseConnection = getDatabaseConnection();
    try {
        await databaseConnection.connect();
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
    await databaseConnection.disconnect();
    process.exit(0);
};
emailLastPublishedProducts();
//# sourceMappingURL=emailLastPublishedProducts.cli.js.map
//# debugId=c054e2f8-8657-5a88-80fb-474f97e021b7
