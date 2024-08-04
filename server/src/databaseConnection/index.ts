import { createSingletonGetter } from "@/utils/singleton.js";
import { createMongoConnection } from "./mongo/index.js";
import { DatabaseConnection } from "./types.js";

const createDatabaseConnection = (): DatabaseConnection => {
  return createMongoConnection();
};

export const getDatabaseConnection = createSingletonGetter(createDatabaseConnection);
