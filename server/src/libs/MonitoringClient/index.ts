import { createSingletonGetter } from "@/utils/singleton.js";
import { LogLevel, MonitoringClient } from "./type.js";

export const createMonitoringClient = (): MonitoringClient => {
  return {
    sendEvent: async ({ eventName, data, level }) => {
      if (level === LogLevel.ERROR) {
        console.error({ eventName, data, level });
      } else if (level === LogLevel.WARNING) {
        console.warn({ eventName, data, level });
      } else {
        console.log({ eventName, data, level });
      }
    },
  };
};

export const getMonitoringClient = createSingletonGetter(createMonitoringClient);
