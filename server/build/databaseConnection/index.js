import { createSingletonGetter } from "../utils/singleton.js";
import { createMongoConnection } from "./mongo/index.js";
const createDatabaseConnection = () => {
    return createMongoConnection();
};
export const getDatabaseConnection = createSingletonGetter(createDatabaseConnection);
