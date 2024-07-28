import { configs } from "@/configs";
import mongoose from "mongoose";
import { DatabaseConnection } from "../types";

export const createMongoConnection = (): DatabaseConnection => {
  return {
    connect: async () => {
      if (!configs.MONGODB_URI) {
        throw new Error("MONGODB_URI is not set");
      }
      await mongoose.connect(configs.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    },
    disconnect: async () => {
      await mongoose.disconnect();
    },
    isConnected: async () => {
      return mongoose.connection.readyState === 1;
    },
  };
};
