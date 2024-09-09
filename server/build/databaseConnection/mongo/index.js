
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c94d6554-95a9-574d-a460-5cfb00df9701")}catch(e){}}();
import { configs } from "../../configs.js";
import mongoose from "mongoose";
export const createMongoConnection = () => {
    return {
        connect: async () => {
            await mongoose.connect(configs.MONGODB_URI);
        },
        disconnect: async () => {
            await mongoose.disconnect();
        },
        isConnected: async () => {
            return mongoose.connection.readyState === 1;
        },
    };
};
//# sourceMappingURL=index.js.map
//# debugId=c94d6554-95a9-574d-a460-5cfb00df9701
