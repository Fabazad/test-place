
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e612fb14-083b-51e7-a5dd-a0418eff5d47")}catch(e){}}();
import { createSingletonGetter } from "../utils/singleton.js";
import { createMongoConnection } from "./mongo/index.js";
const createDatabaseConnection = () => {
    return createMongoConnection();
};
export const getDatabaseConnection = createSingletonGetter(createDatabaseConnection);
//# sourceMappingURL=index.js.map
//# debugId=e612fb14-083b-51e7-a5dd-a0418eff5d47
