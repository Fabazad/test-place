import { configs } from "@/configs.js";
import { createSingletonGetter } from "@/utils/singleton.js";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { LogLevel, MonitoringClient } from "./type.js";

const createMonitoringClient = (): MonitoringClient => {
  return {
    init: () => {
      Sentry.init({
        dsn: configs.SENTRY_DSN,
        integrations: [nodeProfilingIntegration()],
        // Tracing
        tracesSampleRate: 1.0, //  Capture 100% of the transactions

        // Set sampling rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: 1.0,
      });
    },
    sendEvent: async ({ eventName, data, level }) => {
      if (level === LogLevel.ERROR) {
        Sentry.captureMessage(eventName, { level: "error", extra: data });
      } else if (level === LogLevel.WARNING) {
        Sentry.captureMessage(eventName, { level: "warning", extra: data });
      } else if (level === LogLevel.INFO) {
        Sentry.captureMessage(eventName, { level: "info", extra: data });
      } else {
        Sentry.captureMessage(eventName, { level: "debug", extra: data });
      }
    },
    setupErrorHandler: ({ app }) => {
      Sentry.setupExpressErrorHandler(app);
    },
  };
};

export const getMonitoringClient = createSingletonGetter(createMonitoringClient);
