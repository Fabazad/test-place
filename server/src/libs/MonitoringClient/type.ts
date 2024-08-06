export const LogLevel = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export type MonitoringClient = {
  sendEvent: (params: { eventName: string; data: any; level: LogLevel }) => Promise<void>;
};
