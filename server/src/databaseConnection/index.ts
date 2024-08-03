import { createSingletonGetter } from "@/utils/singleton";
import { createMongoConnection } from "./mongo";
import { DatabaseConnection } from "./types";

const createDatabaseConnection = (): DatabaseConnection => {
  return createMongoConnection();
};

export const getDatabaseConnection = createSingletonGetter(createDatabaseConnection);
