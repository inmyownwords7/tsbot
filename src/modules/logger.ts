import { createLogger, format, Logger, transports } from "winston";
import { DATE_FORMAT } from "../formatting/constants.js";
import { colors } from "../formatting/chalk.js";
/**
 * Creates a chat logger for a specific channel
 * @param {string} channel - The name of the chat channel
 * @param {MessageMetaData} metadata - Metadata about the user
 * @returns {Logger} Winston logger instance
 */
const createChatLogger = async (
  channel: string,
  metadata: MessageMetaData
): Promise<Logger> => {

  return createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({ format: DATE_FORMAT }), // Use DATE_FORMAT for timestamp
      format.printf(({ level, message, timestamp }) => {
        try {
          const hasRole = (role: keyof MessageMetaData): boolean =>
            !!metadata[role];

          // Determine role color if applicable
          let formattedMessage = `${timestamp} [CHAT ${level}]: ${message}`;

          if (hasRole("isBroadcaster")) {
            formattedMessage = colors.broadcaster(formattedMessage);
          } else if (hasRole("isStaff")) {
            formattedMessage = colors.staff(formattedMessage);
          } else if (hasRole("isMod")) {
            formattedMessage = colors.moderator(formattedMessage);
          // } else if (message.split(" ").includes("@woooordbot")) {
          //   formattedMessage = colors.self(formattedMessage);
          // }
          }

          // Check if the channel has permissions for color formatting
          if (colors[channel]) {
            const channelColor = colors[channel] || colors.defaultColor;
            formattedMessage = channelColor(formattedMessage); // Apply channel color after role
          }

          // Return the final formatted message
          return formattedMessage;
        } catch (error) {
          // Log the error and return a fallback message
          console.error("Error formatting chat message:", error);
          return `${timestamp} [CHAT ${level}]: [ERROR] ${message}`;
        }
      })
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: "chat.log" }),
    ],
  });
};
// HTTP Logger
/**
 * Logger for HTTP requests
 * @type {Logger}
 */
const httpLogger: Logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: DATE_FORMAT }), // Use DATE_FORMAT for timestamp
    format.printf(
      ({ level, message, timestamp }) =>
        `${timestamp} [HTTP ${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "http.log" }),
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
export const logChatMessage = async (
  channel: string,
  user: string,
  text: string,
  metadata: MessageMetaData
): Promise<void> => {
  const logger = await createChatLogger(channel, metadata); // Create logger for each channel
  const message = `${channel}: ${user}: ${text}`.replaceAll(/\[3[^ ]m/g, "");
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
