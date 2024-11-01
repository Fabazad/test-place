
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="275a9735-3c70-5a59-a901-f25220a69674")}catch(e){}}();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { createSingletonGetter } from "../../utils/singleton.js";
import { getAmazonProductDetails } from "./paapiProductHelpers/index.js";
const createAmazonClient = () => {
    return {
        getAmazonProductDetails,
    };
};
export const getAmazonClient = createSingletonGetter(createAmazonClient);
//# sourceMappingURL=index.js.map
//# debugId=275a9735-3c70-5a59-a901-f25220a69674
