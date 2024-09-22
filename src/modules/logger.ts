import { createLogger, format, Logger, transports } from 'winston';
import { colors } from '../formatting/chalk.js'; // Assuming 'colors' is an object with channel names as keys
import { DATE_FORMAT } from "../formatting/constants.js";

// Function to create a chat logger with the dynamic channel name
/**
 * Creates a chat logger for a specific channel
 * @param {string} channel - The name of the chat channel
 * @returns {Logger} Winston logger instance
 */
const createChatLogger = (channel: string): Logger => createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: DATE_FORMAT }), // Use DATE_FORMAT for timestamp
    format.printf(({ level, message, timestamp }) =>
      colors[channel] 
        ? colors[channel](`${timestamp} [CHAT ${level}]: ${message}`) 
        : `${timestamp} [CHAT ${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'chat.log' })
  ],
});

// HTTP Logger
/**
 * Logger for HTTP requests
 * @type {Logger}
 */
const httpLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: DATE_FORMAT }), // Use DATE_FORMAT for timestamp
    format.printf(({ level, message, timestamp }) =>
      `${timestamp} [HTTP ${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'http.log' })
  ],
});

// Function to log chat messages
/**
 * Logs a chat message
 * @param {string} channel - The name of the chat channel
 * @param {string} user - The user sending the message
 * @param {string} text - The message text
 * @param {object} metadata - Additional metadata (if any)
 */
export const logChatMessage = (
  channel: string,
  user: string,
  text: string,
  metadata: any
): void => {
  const logger = createChatLogger(channel); // Create logger for each channel
  const message = `${channel}: ${user}: ${text}`;
  logger.info(message); // Log the message using the channel-specific logger
};

// Function to log HTTP requests
/**
 * Logs an HTTP message
 * @param {string} message - The HTTP message to log
 */
export const logHttpMessage = (message: string): void => {
  httpLogger.info(message);
};

export { httpLogger };
