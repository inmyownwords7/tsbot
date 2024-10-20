import fs from "fs/promises"; // Using the Promise-based version of the fs module
import { CHANNEL_DATA_PATH, CHATUSER_PATH } from "../formatting/constants.js";
import { ChatMessage } from "@twurple/chat";

/**
 * Description placeholder
 * @event date 1:09:21 pm
 *
 * @interface ChannelConfig
 * @type {ChannelConfig}
 */
// interface ChannelConfig {
//   /**
//    * Description placeholder
//    * @event date 1:09:21 pm
//    *
//    * @type {boolean}
//    */
//   isForeignEnabled: boolean;
//   /**
//    * Description placeholder
//    * @event date 1:09:21 pm
//    *
//    * @type {boolean}
//    */
//   shouldThankSubscription: boolean;
//   /**
//    * Description placeholder
//    * @event date 1:09:21 pm
//    *
//    * @type {boolean}
//    */
//   toggleLog: boolean;
//   /**
//    * Description placeholder
//    * @event date 1:09:21 pm
//    *
//    * @type {string}
//    */
//   logColor: string;
//   /**
//    * Description placeholder
//    * @event date 1:09:21 pm
//    *
//    * @type {boolean}
//    */
//   isFlamingEnabled: boolean;
//   /**
//    * Description placeholder
//    * @event date 1:09:21 pm
//    *
//    * @type {boolean}
//    */
//   toggleTempo: boolean;
//   /**
//    * Description placeholder
//    * @event date 1:09:21 pm
//    *
//    * @type {number}
//    */
//   banCount: number;
//   /**
//    * Description placeholder
//    * @event date 1:09:21 pm
//    *
//    * @type {number}
//    */
//   messageDeletedCounter: number;
//   /**
//    * Description placeholder
//    * @event date 1:09:21 pm
//    *
//    * @type {number}
//    */
//   timeCounter: number;
//   /**
//    * Description placeholder
//    * @event date 1:09:21 pm
//    *
//    * @type {number}
//    */
//   subCounter: number;
//   /**
//    * Description placeholder
//    * @event date 1:09:20 pm
//    *
//    * @type {boolean}
//    */
//   accountUserAge: boolean;
//   /**
//    * Description placeholder
//    * @event date 1:09:20 pm
//    *
//    * @type {boolean}
//    */
//   isKoreanEnabled: boolean;
// }

/**
 * Description placeholder
 * @event date 1:09:20 pm
 *
 * @type {Array<{ channelName: string }>}
 */
let channels: Array<{ channelName: string }> = [
  { channelName: "tfblade" },
  { channelName: "iwdominate" },
  { channelName: "perkz_lol" },
  { channelName: "akanemsko" },
];

// Dynamically create `channelColors` from the `channels` array
let channelColors: Record<string, string> = channels.reduce(
  (acc, { channelName }) => {
    acc[channelName] = ""; // Initialize each channel with an empty string or default value
    return acc;
  },
  {} as Record<string, string>
);

let userIds: string[] = [];
/**
 * Description placeholder
 * @event date 1:09:20 pm
 *
 * @type {Map<string, ChannelConfig>}
 */
let channelsMap: Map<string, ChannelConfig> = new Map();
let userDataMap: Map<string, userData> = new Map();
/**
 * Description placeholder
 * @event date 1:09:20 pm
 *
 * @type {"./channelsData.json"}
 */
// const CHANNEL_DATA_PATH: string = "./channelsData.json";

// JSON replacer for serialization
/**
 * Description placeholder
 * @event date 1:09:20 pm
 *
 * @param {string} key
 * @param {*} value
 * @returns {*}
 */
function jsonReplacer(key: string, value: unknown): unknown {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    };
  }
  return value;
}

// JSON reviver for deserialization
/**
 * Description placeholder
 * @event date 1:09:20 pm
 *
 * @param {string} key
 * @param {*} value
 * @returns {*}
 */
function jsonReviver(key: string, value: unknown): unknown {
  if (
    typeof value === "object" &&
    value !== null &&
    (value as { dataType?: string }).dataType === "Map"
  ) {
    return new Map((value as { value: [string, unknown][] }).value);
  }
  return value;
}

/**
 * Description placeholder
 * @event date 1:09:20 pm
 *
 * @async
 * @returns {Promise<void>}
 *         akanemsko: "",
        tfblade: "59308271", // Set known user ID for tfblade
        iwdominate: "25653002", 
        perkz_lol: "",
      }
 */
async function setupConfig(): Promise<void> {
  try {
    const fileExists: boolean = await fs
      .access(CHANNEL_DATA_PATH)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      console.log(`${CHANNEL_DATA_PATH} not found. Creating new file...`);

      channels.forEach((channelEntry) => {
        const universalLanguage: Record<string, boolean> = {
          tfblade: false,
          iwdominate: false,
          perkz_lol: false,
          akanemsko: false,
        };

        const account: Record<string, boolean> = {
          akanemsko: false,
          tfblade: false,
          iwdominate: true,
          perkz_lol: false,
        };

        const subscription: Record<string, boolean> = {
          akanemsko: false,
          tfblade: false,
          iwdominate: true,
          perkz_lol: false,
        };

        const chatColor: Record<string, string> = {
          akanemsko: "",
          tfblade: "#FF7F50",
          iwdominate: "#FF7F50",
          perkz_lol: "",
        };

        // const channelColor =
        //   channelColors[channelEntry.channelName] || "#FFFFFF"; // Ensure default color
        channelsMap.set(channelEntry.channelName, {
          isForeignEnabled: universalLanguage[channelEntry.channelName],
          shouldThankSubscription: subscription[channelEntry.channelName],
          toggleLog: true,
          logColor: chatColor[channelEntry.channelName],
          isFlamingEnabled: false,
          toggleTempo: false,
          banCount: 1,
          messageDeletedCounter: 1,
          timeCounter: 1,
          subCounter: 1,
          accountUserAge: account[channelEntry.channelName],
          isKoreanEnabled: account[channelEntry.channelName],
        });
      });

      const formattedData = { channelsMap };
/**@access JSONWriter */
      await fs.writeFile(
        CHANNEL_DATA_PATH,
        JSON.stringify(formattedData, jsonReplacer, 4),
        { encoding: "utf-8" }
      );
      console.log(`${CHANNEL_DATA_PATH} created successfully.`);
    } else {
      console.log(`Loading configuration from ${CHANNEL_DATA_PATH}...`);
/**@access JSONReader */
      const rawData = await fs.readFile(CHANNEL_DATA_PATH, "utf-8");
      const parsedData = JSON.parse(rawData, jsonReviver);

      if (parsedData && parsedData.channelsMap) {
        channelsMap = parsedData.channelsMap;
        console.log("Configuration loaded successfully.");
      } else {
        throw new Error("Invalid data format in the JSON file.");
      }
    }
  } catch (error) {
    console.error(`Error during setup: ${error}`);
  }
}
async function loadChatUserData(): Promise<void> {
  try {
    const chatUserFileExists = await fs
      .access(CHATUSER_PATH)
      .then(() => true)
      .catch(() => false);

    if (!chatUserFileExists) {
      console.log(`${CHATUSER_PATH} not found. Creating new file...`);

      // Convert `userDataMap` to a plain object for saving
      const formattedUserData = { userData: Array.from(userDataMap.entries()) };
      let arraySaved = "there is currently: " + userDataMap.size;
      console.log(arraySaved);
      await fs.writeFile(
        CHATUSER_PATH,
        JSON.stringify(formattedUserData, jsonReplacer, 4),
        { encoding: "utf-8" }
      );
      console.log(`${CHATUSER_PATH} created successfully.`);
    } else {
      console.log(`Loading chat users from ${CHATUSER_PATH}...`);

      const rawChatUserData = await fs.readFile(CHATUSER_PATH, "utf-8");
      const parsedChatUserData = JSON.parse(rawChatUserData, jsonReviver);

      if (parsedChatUserData && parsedChatUserData.userData) {
        userDataMap = new Map(parsedChatUserData.userData);
        console.log("Chat user data loaded successfully.");
      } else {
        throw new Error("Invalid data format in the chat user JSON file.");
      }
    }
  } catch (error) {
    console.error(`Error during setup: ${error}`);
  }
}

async function saveChatMessageData(metadata: any): Promise<void> {
  try {
    const userId: string = metadata.userId;
    if (!userDataMap.has(userId)) {
      // Create or update user data
      const userData = {
        channelId: metadata.channelId,
        userId: userId,
        isMod: metadata.isMod || false,
        isVip: metadata.isVip || false,
        isBroadcaster: metadata.isBroadcaster || false,
        isSubscriber: metadata.isSubscriber || false,
        userName: metadata.userName || undefined,
        founder: metadata.isFounder || false,
        color: metadata.color || undefined,
      };

      // Update the map
      userDataMap.set(userId, userData);

      if (metadata.channelId && metadata.color) {
        channelColors[metadata.channelId] = metadata.color;
        // console.log(
        //   `Updated color for channel ${metadata.channelId}: ${metadata.color}`
        // );
      }

      // Convert `userDataMap` to a plain object for saving
      const formattedUserData = { userData: Array.from(userDataMap.entries()) };

      await fs.writeFile(
        CHATUSER_PATH,
        JSON.stringify(formattedUserData, jsonReplacer, 4),
        { encoding: "utf-8" }
      );
      // console.log(`Chat metadata for user ${userId} saved successfully.`);
    } else {
      // console.log(`User ${userId} already exists. Skipping save.`);
    }
  } catch (error) {
    console.error(`Error saving chat metadata: ${error}`);
  }
}

function getUserCount(): number {
  return userDataMap.size;
}

// Usage:

async function getUserCountFromFile(): Promise<number> {
  try {
    const rawChatUserData = await fs.readFile(CHATUSER_PATH, "utf-8");
    const parsedChatUserData = JSON.parse(rawChatUserData, jsonReviver);

    if (parsedChatUserData && parsedChatUserData.userData) {
      // Get the number of users from the parsed data array
      return parsedChatUserData.userData.length;
    } else {
      throw new Error("Invalid data format in the chat user JSON file.");
    }
  } catch (error) {
    console.error(`Error reading user count from file: ${error}`);
    return 0;
  }
}

async function updateChannelColor(
  channel: string,
  user: string,
  color: string | undefined,
  userId: string,
  msg: ChatMessage
): Promise<void> {
  if (typeof color === "undefined") {
    console.log(`Color is undefined. Skipping update.`);
    return;
  }

  // Validate if the color is a valid hex string
  const isValidHexColor = /^#([0-9A-F]{3}){1,2}$/i.test(color);
  if (!isValidHexColor) {
    console.log(`Invalid color value: ${color}. Skipping update.`);
    return;
  }
  // Retrieve the actual user ID from the message
  let msgUserId = msg.userInfo.userId;

  // Authorized user IDs for specific channels
  const authorizedUserIds: Record<string, string> = {
    tfblade: "59308271",
    iwdominate: "25653002",
    // Add other channels and their respective authorized user IDs here
  };

  // Check if the user is authorized to change the color
  const isAuthorizedUser =
    userId === msgUserId && authorizedUserIds[channel] === userId;

  // Create a new entry if no user data exists and the user is authorized
  let expectedUserData = userDataMap.get(userId);
  // Retrieve expected user data from userDataMap using userId

  if (!expectedUserData && isAuthorizedUser) {
    expectedUserData = {
      userId: userId,
      userName: user,
      channelId: channel,
      isMod: false,
      isVip: false,
      isBroadcaster: false,
      isSubscriber: false,
      color: color,
    };
    // Add the new entry to userDataMap
    userDataMap.set(userId, expectedUserData);
    console.log(
      `Created new user entry for ${user} (${userId}) in channel ${channel}.`
    );
  }

  if (isAuthorizedUser) {
    if (channelColors[channel] !== color) {
      channelColors[channel] = color;
      // console.log(
      //   `Updated color for channel ${expectedUserData?.channelId}: ${color}`
      // );

      // Persist the updated `channelColors` back to the file
      const formattedData = { channelsMap, channelColors };
      await fs.writeFile(
        CHANNEL_DATA_PATH,
        JSON.stringify(formattedData, jsonReplacer, 4),
        { encoding: "utf-8" }
      );
    } else {
      // console.log(
      //   `User ID ${userId} is not authorized to change the color for channel ${channel}.`
      // );
    }
  }
}

setupConfig().catch((error) => console.error(error));

export {
  channelsMap,
  loadChatUserData,
  saveChatMessageData,
  getUserCount,
  getUserCountFromFile,
  channels,
  updateChannelColor,
  channelColors,
};
