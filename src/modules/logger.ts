import { createLogger, format, Logger, transports } from "winston";
import "winston-daily-rotate-file";
import { getTimeFormat } from "../formatting/constants.js";
import { colors, getColor } from "../formatting/chalk.js";
import stripAnsi from "strip-ansi";
import { channelsMap } from "../utils/async config.js";
import { ChatMessage } from "@twurple/chat";


/**
 * Creates a chat logger for a specific channel
 * @param {string} channel - The name of the chat channel
 * @param {MessageMetaData} metadata - Metadata about the user
 * @returns {Logger} Winston logger instance
 */

const channelLogger = new Map();
const createChatLogger = async (
  channel: string,
  metadata: MessageMetaData | undefined,
  msg: ChatMessage
): Promise<Logger> => {
  if (channelLogger.has(channel)) {
    return channelLogger.get(channel);
  }

  const channelConfig = channelsMap.get(channel);
  // console.log(channel);
  if (!channelConfig) {
    console.warn(`No config found for channel: ${channel}`);
  } else {
    // console.log(`Channel config for ${channel}:`, channelConfig);
  }
  // console.log(channelConfig?.logColor + " line 27 ")
  // console.log("Channel config:" + " line 28");
  if (!channelConfig || !channelConfig.toggleLog) {
    throw new Error(`Logging is disabled for channel: ${channel}`);
  }

  const logger = createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({ format: () => getTimeFormat() }), // Use DATE_FORMAT for timestamp
      format.printf(({ level, message, timestamp }) => {
        try {
          const defaultMetaData: MessageMetaData = {
            isMod: false, // Default for isMod
            isBroadcaster: false, // Default for isBroadcaster
            isStaff: false, // Default for isStaff
            isVip: false, // Default for isVip
            isParty: false, // Default for isParty
            isDeputy: false, // Default for isDeputy
            isEntitled: false, // Default for isEntitled
            isPermitted: false, // Default for isPermitted
            channelId: "", // Empty string for IDs
            userId: "", // Empty string for user ID
          };
          const actualMetadata = metadata || defaultMetaData;
          const hasRole = (role: keyof MessageMetaData): boolean =>
            !!actualMetadata[role];

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

          // console.log(channel + "line 70");
          // console.log(colors[channel] + "line 71")
          const colorInstance = getColor(channelConfig.logColor);
          // const channelColor = colors[channelConfig.logColor] || colors.defaultColor;
          // console.log(channelColor + "line 73");
          // formattedMessage = channelColor(formattedMessage); // Apply channel color after role
          formattedMessage = colorInstance(formattedMessage);
          // const logColor = channelConfig.logColor;
          // if (colors[logColor]) {
          //   formattedMessage = colors[logColor](formattedMessage);
          // }

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
      new transports.DailyRotateFile({
        filename: `${channel}-chat-%DATE%.log`,
        dirname: `./Logs/${channel}/`,
        // json: true,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "3d",
        format: format.combine(
          format.timestamp({ format: () => getTimeFormat() }), // Use DATE_FORMAT for timestamp
          format.printf(({ level, message, timestamp }) =>
            stripAnsi(`${timestamp} [CHAT ${level}]: ${message}`)
          ) // No color formatting here
          //   ),
          // }),
          // new transports.File({
          //   filename: "chat.log",
          //   format: format.printf(({ level, message, timestamp }) =>
          //     stripAnsi(`${timestamp} [CHAT ${level}]: ${message}`)
        ), // No color formatting here
      }),
    ],
  });
  channelLogger.set(channel, logger);
  return logger;
};
// HTTP Logger
/**
 * Logger for HTTP requests
 * @type {Logger}
 */
const httpLogger: Logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: () => getTimeFormat() }), // Use DATE_FORMAT for timestamp
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
const logChatMessage = async (
  channel: string,
  user: string,
  text: string,
  msg: ChatMessage,
  metadata?: MessageMetaData
  // msg?: ChatMessage
): Promise<void> => {
  // console.warn(`logChatMessage called for ${channel}: ${user}: ${text}` + " line 155 of logger.ts");
  const logger = await createChatLogger(channel, metadata, msg); // Create logger for each channel
  // console.warn(`Logger created for channel: ${channel}` + " line 157 of logger.ts");
  const message: string = `${channel}: ${user}: ${text}`;
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

export { httpLogger, logChatMessage };
