import fs from "fs/promises"; // Using the Promise-based version of the fs module
//**exported only towards bot.ts */
let channels = [
  { channelName: "tfblade" },
  { channelName: "iwdominate" },
  { channelName: "perkz_lol" },
  { channelName: "akanemsko" },
];

let channelsMap = new Map();
const CHANNEL_DATA = "./channelsData.json";

// JSON replacer for serialization
function jsonReplacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // Convert Map back into an array
    };
  }
  return value;
}

// JSON reviver for deserialization
function jsonReviver(key: string, value: any) {
  if (value && value.dataType === "Map") {
    return new Map(value.value); // Convert array back into a Map
  }
  return value;
}

async function setupConfig(): Promise<void> {
  try {
    // Check if the file exists asynchronously
    const fileExists = await fs
      .access(CHANNEL_DATA)
      .then(() => true)
      .catch(() => false); // Handle the case when the file doesn't exist

    if (!fileExists) {
      console.log(`${CHANNEL_DATA} not found. Creating new file...`);

      channels.forEach((channelEntry) => {
        const universalLanguage: { [key: string]: boolean } = {
          tfblade: false,
          iwdominate: false,
          perkz_lol: false,
          akanemsko: false,
        };

        const channelColors: { [key: string]: string } = {
          tfblade: "green",
          iwdominate: "blue",
          perkz_lol: "yellow", // Added a color for "perkz_lol"
          akanemsko: "red",
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

        // Sets default values for each channel
        channelsMap.set(channelEntry.channelName, {
          isForeignEnabled:
            universalLanguage[channelEntry.channelName] !== undefined
              ? universalLanguage[channelEntry.channelName]
              : false,
          shouldThankSubscription:
            subscription[channelEntry.channelName] !== undefined
              ? subscription[channelEntry.channelName]
              : false,
          toggleLog: true,
          logColor: channelColors[channelEntry.channelName] || "defaultColor", // Fallback to "defaultColor"
          isFlamingEnabled: false,
          toggleTempo: false,
          banCount: 1,
          messageDeletedCounter: 1,
          timeCounter: 1,
          subCounter: 1,
          accountUserAge: account[channelEntry.channelName] || false, // Default to false if not in account object
          isKoreanEnabled: account[channelEntry.channelName] || false, // Default to false if not in account object
        });
      });

      const formattedData = { channelsMap };

      // Write the file asynchronously
      await fs.writeFile(
        CHANNEL_DATA,
        JSON.stringify(formattedData, jsonReplacer, 4),
        { encoding: "utf-8" }
      );
      console.log(`${CHANNEL_DATA} created successfully.`);
    } else {
      console.log(`Loading configuration from ${CHANNEL_DATA}...`);

      // Read the file asynchronously
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

setupConfig().catch((error) => console.error(error)); // Handle any rejected promises

export { channelsMap };
