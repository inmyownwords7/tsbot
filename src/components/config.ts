import fs from "fs";

// Array of channel objects
/**
 * Description placeholder
 * @date Saturday, September 21st 2024, 11:29:17 am
 *
 * @type {Array<{ channelName: string }>}
 */
const channels: Array<{ channelName: string }> = [
  { channelName: "tfblade" },
  { channelName: "iwdominate" },
  { channelName: "perkz_lol" },
  { channelName: "akanemsko" }
]; 

// const channels: { channelName: string }[] = [] shorthand form
// Map to store channel data
/**
 * Description placeholder
 * @date Saturday, September 21st 2024, 11:29:17 am
 *
 * @type {Map<string, any>}
 */
let channelsMap: Map<string, any> = new Map();

// Path to the channel data JSON file
/**
 * @path "./channelsData.json"
 * @date Saturday, September 21st 2024, 11:29:17 am
 *
 * @type {string}
 */
const CHANNEL_DATA: string = "./channelsData.json";

// JSON replacer for serialization
/**
 * Description placeholder
 * @date Saturday, September 21st 2024, 11:29:17 am
 *
 * @param {string} key
 * @param {*} value
 * @returns {*}
 */
function jsonReplacer(key: string, value: Object | undefined): Map<string, Object> | unknown {
  /** @Check if value is an instance of a Map<K, V> 
   *  If so, convert it back into a Map<K, V> 
   * @returns {Object}
  */
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // Convert Map back into an array
    };
  }
  return value;
}

// JSON reviver for deserialization
/**
 * Description placeholder
 * @date Saturday, September 21st 2024, 11:29:17 am
 *
 * @param {string} key
 * @param {*} value
 * @returns {*}
 */
function jsonReviver(key: string, value: any): any {
  if (value && value.dataType === "Map") {
    return new Map(value.value); // Convert array back into a Map
  }
  return value;
}

// Function to set up the configuration
/**
 * Description placeholder
 * @date Saturday, September 21st 2024, 11:29:17 am
 */
function setupConfig(): void {
  try {
    if (!fs.existsSync(CHANNEL_DATA)) {
      console.log(`${CHANNEL_DATA} not found. Creating new file...`);
      
      channels.forEach((channelEntry) => {
        // Channel-specific default settings
        const universalLanguage: { [key: string]: boolean } = {
          tfblade: false,
          iwdominate: false,
          perkz_lol: false,
          akanemsko: false,
        };

        const channelColors: { [key: string]: string } = {
          tfblade: "green",
          iwdominate: "blue",
          perkz_lol: "red",
          akanemsko: "yellow",
        };

        const account: { [key: string]: boolean } = {
          akanemsko: false,
          tfblade: false,
          iwdominate: true,
        };

        const subscription: { [key: string]: boolean } = {
          akanemsko: false,
          tfblade: false,
          iwdominate: true,
          perkz_lol: false,
        };

        // Create the map entry for each channel
        channelsMap.set(channelEntry.channelName, {
          isForeignEnabled:
            universalLanguage[channelEntry.channelName] ?? false,
          shouldThankSubscription:
            subscription[channelEntry.channelName] ?? false,
          toggleLog: true,
          logColor: channelColors[channelEntry.channelName] || "defaultColor",
          isFlamingEnabled: false,
          toggleTempo: false,
          banCount: 1,
          messageDeletedCounter: 1,
          timeCounter: 1,
          subCounter: 1,
          accountUserAge: account[channelEntry.channelName] || false,
          isKoreanEnabled: account[channelEntry.channelName] || false,
        });
      });

      // Serialize the data and write it to the file
      const formattedData = { channelsMap };
      fs.writeFileSync(
        CHANNEL_DATA,
        JSON.stringify(formattedData, jsonReplacer, 4),
        { encoding: "utf-8" }
      );
      console.log(`${CHANNEL_DATA} created successfully.`);
    } else {
      console.log(`Loading configuration from ${CHANNEL_DATA}...`);
      const rawdata = fs.readFileSync(CHANNEL_DATA, "utf-8");
      const parsedData = JSON.parse(rawdata, jsonReviver);

      if (parsedData && parsedData.channelsMap) {
        channelsMap = parsedData.channelsMap;
        console.log(`${CHANNEL_DATA} loaded successfully.`);
      } else {
        throw new Error("Invalid data format in the JSON file");
      }
    }
  } catch (error) {
    console.error(`Error during setup: ${error}`);
  }
}

setupConfig();
export { channelsMap };
