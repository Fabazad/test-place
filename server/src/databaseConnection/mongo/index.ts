import { configs } from "@/configs.js";
import mongoose from "mongoose";
import { DatabaseConnection } from "../types.js";

export const createMongoConnection = (): DatabaseConnection => {
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
