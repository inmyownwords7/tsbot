import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import TransportStream from "winston-transport";

// Define transport configuration types
type ConsoleTransportOptions = ConstructorParameters<typeof transports.Console>[0];
type FileTransportOptions = ConstructorParameters<typeof transports.File>[0];
type DailyRotateFileTransportOptions = ConstructorParameters<typeof DailyRotateFile>[0];

type TransportType = "Console" | "File" | "DailyRotateFile";

interface TransportConfig {
  type: TransportType;
  options?: ConsoleTransportOptions | FileTransportOptions | DailyRotateFileTransportOptions;
}

// Type guards
const isConsoleTransport = (config: TransportConfig): config is { type: "Console"; options?: ConsoleTransportOptions } =>
  config.type === "Console";

const isFileTransport = (config: TransportConfig): config is { type: "File"; options?: FileTransportOptions } =>
  config.type === "File";

const isDailyRotateFileTransport = (
  config: TransportConfig
): config is { type: "DailyRotateFile"; options?: DailyRotateFileTransportOptions } => config.type === "DailyRotateFile";

// Create transport
const createTransport = (transportConfig: TransportConfig): TransportStream => {
  if (isConsoleTransport(transportConfig)) {
    return new transports.Console(transportConfig.options);
  } else if (isFileTransport(transportConfig)) {
    return new transports.File(transportConfig.options);
  } else if (isDailyRotateFileTransport(transportConfig)) {
    return new DailyRotateFile(transportConfig.options);
  } else {
    throw new Error(`Unknown transport type: ${transportConfig.type}`);
  }
};

// Create transports
const createTransports = (transportsConfig: TransportConfig[]): TransportStream[] =>
  transportsConfig.map(createTransport);

const loggerConfig: TransportConfig[] = [
    {
      type: "Console",
      options: { level: "info", format: format.colorize() },
    },
    {
      type: "File",
      options: { level: "error", filename: "logs/error.log" },
    },
    {
      type: "DailyRotateFile",
      options: {
        filename: "logs/app-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      },
    },
  ];
  
  const logger = createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.json()
    ),
    transports: createTransports(loggerConfig),
  });
  
  // Example usage
  logger.info("Logger initialized with transports.");
  logger.error("An error occurred.");
  