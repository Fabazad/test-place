
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e2f0ba3f-404c-5010-b081-38c2be7a4ccc")}catch(e){}}();
import { configs } from "../../configs.js";
import { createSingletonGetter } from "../../utils/singleton.js";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { LogLevel } from "./type.js";
const createMonitoringClient = () => {
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
//# sourceMappingURL=index.js.map
//# debugId=e2f0ba3f-404c-5010-b081-38c2be7a4ccc
