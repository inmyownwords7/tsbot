import { addColors, createLogger, format, Logger, transports } from "winston";
import "winston-daily-rotate-file";
import { BOT_ID, getTimeFormat } from "../formatting/constants.js";
import stripAnsi from "strip-ansi";
import {
  channelsMap,
  channelColors,
  updateChannelColor,
} from "../utils/async config.js";

import { ChatMessage } from "@twurple/chat";
import chalk, { ChalkInstance } from "chalk";

/**
 * Description placeholder
 * @date 1:29:30 pm
 *
 * @type {*}
 */
let { red, blue, green, white, greenBright, cyan }: ChalkInstance = chalk;

/**
 * Description placeholder
 * @date 1:29:30 pm
 *
 * @type {*}
 */
export let roleToRoleColor: Map<string, ChalkInstance> = new Map<string, ChalkInstance>([
  ["self", cyan],
  ["broadcaster", red],
  ["moderator", blue],
  ["vip", green],
  ["subscriber", greenBright],
  ["pleb", white],
]);

/**
 * Description placeholder
 * @date 1:29:30 pm
 *
 * @type {{ levels: { fatal: number; error: number; warn: number; success: number; info: number; debug: number; trace: number; }; colors: { fatal: string; error: string; warn: string; success: string; info: string; debug: string; trace: string; }; }}
 */
const customLevels: { levels: { fatal: number; error: number; warn: number; success: number; info: number; debug: number; trace: number; }; colors: { fatal: string; error: string; warn: string; success: string; info: string; debug: string; trace: string; }; } = {
  levels: {
    fatal: 0, // Highest priority
    error: 1,
    warn: 2,
    success: 3, // Custom level: success
    info: 4,
    debug: 5,
    trace: 6, // Lowest priority
  },
  // Step 2: Define colors for the custom levels (Optional)
  colors: {
    fatal: "red",
    error: "red",
    warn: "yellow",
    success: "green", // Custom color: green for success
    info: "blue",
    debug: "cyan",
    trace: "magenta",
  },
};
addColors(customLevels.colors);

/**
 * Description placeholder
 * @date 1:29:30 pm
 *
 * @type {*}
 */
const jsonFormat: any = format.combine(
  format.json(),
  format.colorize(),
  format.align(),
  format.printf((info) => `${info.level} ${info.message}`)
);
/**
 * Creates a chat logger for a specific channel
 * @param {string} channel - The name of the chat channel
 * @param {MessageMetaData} metadata - Metadata about the user
 * @returns {Logger} Winston logger instance
 */

const channelLoggersMap: Map<string, any> = new Map();
//TODO FINISH FUNCTION TO CREATE COMMANDS, DEL COMMANDS AND EDIT COMMANDS. 
/**
 * Description placeholder
 * @date 1:29:30 pm
 *
 * @async
 * @param {string} channel
 * @param {string} user
 * @param {ChatMessage} msg
 * @returns {Promise<Logger>}
 */
const initializeChannelLogger = async (
  channel: string,
  user: string,
  msg: ChatMessage
): Promise<Logger> => {
  let { isMod, isVip, isSubscriber, isBroadcaster, userId } = msg.userInfo
  if (channelLoggersMap.has(channel)) {
    return channelLoggersMap.get(channel);
  }

  const channelConfig = channelsMap.get(channel);
  if (!channelConfig) {
    console.warn(`No config found for channel: ${channel}`);
  } else {
    // console.log(`Channel config for ${channel}:`, channelConfig);
  }

  if (!channelConfig || !channelConfig.toggleLog) {
    throw new Error(`Logging is disabled for channel: ${channel}`);
  }

  let channelColor = chalk.hex(channelConfig.logColor);
  // console.log(channelConfig.logColor);
  const logger = createLogger({
    level: "info",
    format: format.combine(
      format.colorize(), // Enable color formatting
      format.timestamp({ format: getTimeFormat() }),
      format.metadata(),
      format.printf(({ level, message}) => {
        try {
          const metadataParts: string[] = [];
          let baseColorInstance: ChalkInstance = getChannelColor(channel)

          if (userId === BOT_ID) {
            metadataParts.push("self");
            baseColorInstance =
              roleToRoleColor.get("self") ?? baseColorInstance;
          } else if (isBroadcaster) {
            metadataParts.push("broadcaster");
            baseColorInstance =
              roleToRoleColor.get("broadcaster") ?? baseColorInstance;
          } else if (isMod) {
            metadataParts.push(`Mod`);
            baseColorInstance =
              roleToRoleColor.get("moderator") ?? baseColorInstance;
          } else if (isVip) {
            metadataParts.push(`VIP`);
            baseColorInstance = roleToRoleColor.get("vip") ?? baseColorInstance;
          } else if (isSubscriber) {
            metadataParts.push("subscriber");
            baseColorInstance =
              roleToRoleColor.get("subscriber") ?? baseColorInstance;
          } else {
            metadataParts.push("pleb");
            baseColorInstance = channelColor ?? white;
          }

          const metadataString: string =
            metadataParts.length > 0 ? `[${metadataParts.join(" | ")}]` : "";
          let baseMessage: string = `${getTimeFormat()} ${metadataString} [CHAT ${level}]: ${message}`;

          return baseColorInstance(baseMessage);
        } catch (error) {
          console.error("Error formatting chat message:", error);
          return `${getTimeFormat()} [CHAT ${level}]: [ERROR] ${message}`;
        }
      })
    ),
    transports: [
      new transports.Console({ silent: false }),
      new transports.DailyRotateFile({
        filename: `${channel}-chat-%DATE%.log`,
        dirname: `./Logs/${channel}/`,
        json: false,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "3d",
        format: format.combine(
          format.timestamp({ format: () => getTimeFormat() }), // Use DATE_FORMAT for timestamp
          format.printf(({ level, message, timestamp }) =>
            stripAnsi(`${timestamp} [CHAT ${level}]: ${message}`)
          )
        ),
      }),
    ],
  });
  channelLoggersMap.set(channel, logger);
  return logger;
};
// HTTP Logger
/**
 * Logger for HTTP requests
 * @type {Logger}
 */
const httpRequestLogger: Logger = createLogger({
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
// export function systemLogger() {
// const logger = createLogger({
//     level: 'info',
//     format: format.combine(
//       format.timestamp({ format: () => getTimeFormat() }), // Use DATE_FORMAT for timestamp
//       format.printf(
//         ({ level, message, timestamp }) =>
//           `${timestamp} [SYSTEM ${level}]: ${message}`
//       )
//     ),
//     transports: [new transports.Console(),
//       new transports.DailyRotateFile({
//         filename: `SYSTEM-%DATE%.log`,
//         dirname: `./Logs/`,
//         json: false,
//         datePattern: "YYYY-MM-DD",
//         zippedArchive: true,
//         maxSize: "20m",
//         maxFiles: "3d",
//         format: format.combine(
//           format.timestamp({ format: () => getTimeFormat() }), // Use DATE_FORMAT for timestamp
//           format.printf(({ level, message, timestamp }) =>
//             stripAnsi(`${timestamp} [SYSTEM ${level}]: ${message}`)
//           )
//         ),
//       })
//     ]
//   })
// }
export const systemLogger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: () => getTimeFormat() }), // Use DATE_FORMAT for timestamp
    format.printf(
      ({ level, message, timestamp }) =>
        `${timestamp} [SYSTEM ${level}]: ${message}`
    )
  ),
  transports: [new transports.Console(),
    new transports.DailyRotateFile({
      filename: `SYSTEM-%DATE%.log`,
      dirname: `./Logs/`,
      json: false,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "3d",
      format: format.combine(
        format.timestamp({ format: () => getTimeFormat() }), // Use DATE_FORMAT for timestamp
        format.printf(({ level, message, timestamp }) =>
          stripAnsi(`${timestamp} [SYSTEM ${level}]: ${message}`)
        )
      ),
    })
  ]
})
/**
 * Description placeholder
 * @date 1:29:30 pm
 *
 * @param {string} channelName
 * @returns {ChalkInstance}
 */
function getChannelColor(channelName: string): ChalkInstance {
  const hexColor = channelColors[channelName];
  return hexColor ? chalk.hex(hexColor) : chalk.white; // Default to white if no color is set
}

// Function to log chat messages
/**
 * Logs a chat message
 * @param {string} channel - The name of the chat channel
 * @param {string} user - The user sending the message
 * @param {string} text - The message text
 * @param {object} msg
 */

let logChannelMessage = async (
  channel: string,
  user: string,
  text: string,
  msg: ChatMessage
): Promise<void> => {
  let {
    isMod,
    isSubscriber,
    isVip,
    isBroadcaster,
    userId,
    displayName,
    color,
    isFounder,
  } = msg.userInfo;
  let { channelId } = msg;

  if (color) {
    await updateChannelColor(channel, user, color, userId, msg);
  }

  let metadata: BadgesAndEmotes = {
    channelId: channelId || undefined,
    isMod: isMod,
    isSubscriber: isSubscriber,
    isVip: isVip,
    isFounder: isFounder,
    isBroadcaster: isBroadcaster,
    userId: userId,
    userName: displayName,
    badges: msg.userInfo.badges,
    color: color || undefined,
    messages: [], // Badges can include things like VIP, mod, etc.
  };

  // console.warn(`logChannelMessagecalled for ${channel}: ${user}: ${text}` + " line 155 of logger.ts");
  let channelLoggerInstance = await initializeChannelLogger(channel, user, msg); // Create logger for each channel
  let logEntry: string = `${channel}: ${user}: ${text}`;
  if (user != "nightbot") {
    channelLoggerInstance.info(logEntry, metadata); // Log the message using the channel-specific logger
  }
};

// Function to log HTTP requests
/**
 * Logs an HTTP message
 * @param {string} message - The HTTP message to log
 */
const logHttpRequest = (message: string): void => {
  httpRequestLogger.info(message);
};

export { httpRequestLogger, logChannelMessage, logHttpRequest };
