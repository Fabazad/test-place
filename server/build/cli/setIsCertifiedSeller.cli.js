
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="74b020f3-7c73-5742-b03b-480556978c8b")}catch(e){}}();
import { UserController } from "../controllers/user.controller.js";
import { getDatabaseConnection } from "../databaseConnection/index.js";
import { z } from "zod";
const setIsCertifiedSeller = async () => {
    const { sellerId, isCertified } = z
        .object({
        sellerId: z.string(),
        isCertified: z.coerce.boolean(),
    })
        .parse({ sellerId: process.argv[2], isCertified: process.argv[3] });
    const databaseConnection = getDatabaseConnection();
    try {
        await databaseConnection.connect();
        const result = await UserController.setUserCertification({
            userId: sellerId,
            isCertified,
        });
        console.log(result);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await databaseConnection.disconnect();
    }
};
setIsCertifiedSeller();
//# sourceMappingURL=setIsCertifiedSeller.cli.js.map
//# debugId=74b020f3-7c73-5742-b03b-480556978c8b
