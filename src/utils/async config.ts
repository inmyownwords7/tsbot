import fs from "fs/promises"; // Using the Promise-based version of the fs module
import { CHANNEL_DATA } from "../formatting/constants.js";
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

/**
 * Description placeholder
 * @event date 1:09:20 pm
 *
 * @type {Map<string, ChannelConfig>}
 */
let channelsMap: Map<string, ChannelConfig> = new Map();
/**
 * Description placeholder
 * @event date 1:09:20 pm
 *
 * @type {"./channelsData.json"}
 */
// const CHANNEL_DATA: string = "./channelsData.json";

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
 */
async function setupConfig(): Promise<void> {
  try {
    const fileExists: boolean = await fs
      .access(CHANNEL_DATA)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      console.log(`${CHANNEL_DATA} not found. Creating new file...`);

      channels.forEach((channelEntry) => {
        const universalLanguage: Record<string, boolean> = {
          tfblade: false,
          iwdominate: false,
          perkz_lol: false,
          akanemsko: false,
        };

        const channelColors: Record<string, string> = {
          tfblade: "green",
          iwdominate: "blue",
          perkz_lol: "yellow",
          akanemsko: "red",
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

        channelsMap.set(channelEntry.channelName, {
          isForeignEnabled: universalLanguage[channelEntry.channelName],
          shouldThankSubscription: subscription[channelEntry.channelName],
          toggleLog: true,
          logColor: channelColors[channelEntry.channelName] || "defaultColor",
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

      await fs.writeFile(
        CHANNEL_DATA,
        JSON.stringify(formattedData, jsonReplacer, 4),
        { encoding: "utf-8" }
      );
      console.log(`${CHANNEL_DATA} created successfully.`);
    } else {
      console.log(`Loading configuration from ${CHANNEL_DATA}...`);

      const rawdata = await fs.readFile(CHANNEL_DATA, "utf-8");
      const parsedData = JSON.parse(rawdata, jsonReviver);

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

setupConfig().catch((error) => console.error(error));

export { channelsMap };
