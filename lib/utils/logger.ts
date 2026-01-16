/**
 * Centralized logging utility
 */

type LogLevel = "error" | "warn" | "info" | "debug";

const isDevelopment = process.env.NODE_ENV === "development";

function log(level: LogLevel, ...args: unknown[]) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  switch (level) {
    case "error":
      console.error(prefix, ...args);
      break;
    case "warn":
      console.warn(prefix, ...args);
      break;
    case "info":
      if (isDevelopment) {
        console.log(prefix, ...args);
      }
      break;
    case "debug":
      if (isDevelopment) {
        console.debug(prefix, ...args);
      }
      break;
  }
}

export const logger = {
  error: (...args: unknown[]) => log("error", ...args),
  warn: (...args: unknown[]) => log("warn", ...args),
  info: (...args: unknown[]) => log("info", ...args),
  debug: (...args: unknown[]) => log("debug", ...args),
};
