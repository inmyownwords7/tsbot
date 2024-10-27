import { mapTypes, CHANNEL_DATA_PATH } from "../formatting/constants.js";
import { loadJSONData, saveJSONData } from "../utils/dataUtils.js";

// Function to set up channel configuration
export async function setupConfig(): Promise<void> {
  const defaultChannelConfig: ChannelConfig = {
    isForeignEnabled: false,
    shouldThankSubscription: false,
    toggleLog: true,
    logColor: "#FFFFFF",
    isFlamingEnabled: false,
    toggleTempo: false,
    banCount: 1,
    messageDeletedCounter: 1,
    timeCounter: 1,
    subCounter: 1,
    accountUserAge: false,
    isKoreanEnabled: false,
  };
  const data = await loadJSONData(CHANNEL_DATA_PATH);
  /**@TODO merge with channels */
  if (!data) {
    console.log(`${CHANNEL_DATA_PATH} not found. Creating new file...`);
    const channels: ChannelInterface[] = [
      { channelName: "tfblade", isLive: false },
      { channelName: "iwdominate", isLive: false },
      { channelName: "perkz_lol", isLive: false },
      { channelName: "akanemsko", isLive: false },
    ];
    channels.forEach((channelEntry: { channelName: string }) => {
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

      mapTypes.CHANNEL_MAP.set(channelEntry.channelName, {
        isForeignEnabled: universalLanguage[channelEntry.channelName],
        shouldThankSubscription: subscription[channelEntry.channelName],
        toggleLog: true,
        logColor: chatColor[channelEntry.channelName] || "#FFFFFF", // Fallback color
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
    await saveJSONData(CHANNEL_DATA_PATH, {
      channelsMap: Array.from(mapTypes.CHANNEL_MAP.entries()),
    });
  } else {
    mapTypes.CHANNEL_MAP.clear();
    Object.entries(data.channelsMap).forEach(([channelName, config]) => {
      const channelConfig = config as ChannelConfig;

      // Merge with the default configuration
      const finalConfig: ChannelConfig = {
        ...defaultChannelConfig, // Use default values
        ...channelConfig, // Override with loaded values
      };

      mapTypes.CHANNEL_MAP.set(channelName, finalConfig);
    });
    console.log("Configuration loaded successfully.");
  }
}
