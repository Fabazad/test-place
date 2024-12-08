
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="440ccd3b-53d4-5d0d-9c13-8b7971507321")}catch(e){}}();
import { UserController } from "../controllers/user.controller.js";
import { z } from "zod";
const setIsCertifiedSeller = async () => {
    const { sellerId, isCertified } = z
        .object({
        sellerId: z.string(),
        isCertified: z.coerce.boolean(),
    })
        .parse({ sellerId: process.argv[2], isCertified: process.argv[3] });
    const result = await UserController.setUserCertification({
        userId: sellerId,
        isCertified,
    });
    console.log(result);
};
setIsCertifiedSeller();
//# sourceMappingURL=setIsCertifiedSeller.cli.js.map
//# debugId=440ccd3b-53d4-5d0d-9c13-8b7971507321
