import { Express } from "express";

export const LogLevel = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export type MonitoringClient = {
  init: () => void;
  sendEvent: (params: { eventName: string; data: any; level: LogLevel }) => Promise<void>;
  setupErrorHandler: (params: { app: Express }) => void;
};
