
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7a56c66d-b912-584f-9421-67477ed9167f")}catch(e){}}();
import { configs } from "../configs.js";
import { ProductController } from "../controllers/product.controller.js";
import { getMonitoringClient } from "../libs/MonitoringClient/index.js";
import { getDatabaseConnection } from "../databaseConnection/index.js";
import dayjs from "dayjs";
const emailLastPublishedProducts = async () => {
    if (dayjs().day() !== 6) {
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
        });
    }
    catch (err) {
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
//# debugId=7a56c66d-b912-584f-9421-67477ed9167f
