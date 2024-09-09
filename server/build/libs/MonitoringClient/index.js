import { createSingletonGetter } from "../../utils/singleton.js";
import Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { LogLevel } from "./type.js";
const createMonitoringClient = () => {
    return {
        init: () => {
            Sentry.init({
                dsn: "https://8763211000cbfd941172a1fe1187c3d8@o1374122.ingest.us.sentry.io/4507923924058112",
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
            }
            else if (level === LogLevel.WARNING) {
                Sentry.captureMessage(eventName, { level: "warning", extra: data });
            }
            else if (level === LogLevel.INFO) {
                Sentry.captureMessage(eventName, { level: "info", extra: data });
            }
            else {
                Sentry.captureMessage(eventName, { level: "debug", extra: data });
            }
        },
        setupErrorHandler: ({ app }) => {
            Sentry.setupExpressErrorHandler(app);
        },
    };
};
export const getMonitoringClient = createSingletonGetter(createMonitoringClient);
