
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6d527a47-2be1-5c33-830c-3d349735197f")}catch(e){}}();
import { getAmazonClient } from "../libs/AmazonClient/index.js";
const test = async () => {
    const amazonClient = getAmazonClient();
    try {
        await amazonClient.getAmazonProductDetails({ asin: "B0D97XRSZ3" });
    }
    catch (err) {
        console.error({ err });
    }
    process.exit(0);
};
test();
//# sourceMappingURL=test.js.map
//# debugId=6d527a47-2be1-5c33-830c-3d349735197f
