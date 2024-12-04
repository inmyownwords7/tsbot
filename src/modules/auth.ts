import { AccessToken } from '@twurple/auth';
import { botId } from "../formatting/constants.js";
import { RefreshingAuthProvider } from "@twurple/auth";
import { EventSubWsListener } from '@twurple/eventsub-ws';
import { ApiClient } from "@twurple/api";
import { readFile, writeFile } from "fs/promises";

/**
 * Description placeholder
 * @date 10:30:53 am
 *
 * @interface AuthConfig
 * @typedef {AuthConfig}
 */
interface AuthConfig {
  /**
   * Description placeholder
   * @date 10:30:53 am
   *
   * @type {string}
   */
  clientId: string;
  /**
   * Description placeholder
   * @date 10:30:53 am
   *
   * @type {string}
   */
  clientSecret: string;
}

/**
 * Description placeholder
 * @date 10:30:53 am
 *
 * @type {*}
 */

/**
 * Description placeholder
 * @date 10:30:52 am
 *
 * @type {AuthConfig}
 */
const credentials: AuthConfig = {
  clientId: process.env.CLIENTID || "k3kjal6wl67bmcm0avngpkpnikaseh",
  clientSecret: process.env.CLIENTSECRET ||"ybmuwh1pqyk7alcwchyyqwydvd8jjj",
};
console.log(credentials.clientId + " "+ credentials.clientSecret)
/**
 * Description placeholder
 * @date 10:30:52 am
 *
 * @type {string}
 */

/**
 * Description placeholder
 * @date 10:30:52 am
 *
 * @type {*}
 */
const authProvider: RefreshingAuthProvider = new RefreshingAuthProvider(credentials);

/**
 * Description placeholder
 * @date 10:30:52 am
 *
 * @async
 * @returns {*}
 */
const initializeAuthProvider = async (): Promise<void> => {
  try {
    const tokenData: AccessToken = JSON.parse(
      await readFile(`./tokens.${botId}.json`, "utf-8")
    );

    // Add token with required intents: chat, api, and eventsub
    await authProvider.addUserForToken(tokenData, ['chat', 'api', 'eventsub']);

    // Listen for token refreshes and update the token file
    authProvider.onRefresh(async (userId: string, newTokenData: AccessToken) => {
      await writeFile(
        `./tokens.${userId}.json`,
        JSON.stringify(newTokenData, null, 4),
        "utf-8"
      );
    });
  } catch (error) {
    console.error("Error initializing AuthProvider:", error);
    process.exit(1);
  }
};
try {
  // Initialize authProvider first
  await initializeAuthProvider();
  console.log("AuthProvider initialized successfully");
} catch (err) {
  console.error("An error occurred during initialization:", err);
  process.exit(1);
}

// Set up the ApiClient with the initialized authProvider
/**
 * Description placeholder
 * @date 10:30:52 am
 *
 * @type {*}
 */
const api: ApiClient = new ApiClient({ authProvider });

// Set up the EventSub WebSocket listener with the ApiClient
/**
 * Description placeholder
 * @date 10:30:52 am
 *
 * @type {*}
 */
const eventSubListener: EventSubWsListener = new EventSubWsListener({
  apiClient: api,
  url: 'ws://127.0.0.1:8080/ws'
})

// Function to start the listener and subscribe to the ban event
/**
 * Description placeholder
 * @date 10:30:52 am
 *
 * @async
 * @returns {*}
 */
const initializeEventSub = async (): Promise<void> => {
  try {
    await eventSubListener.start();
    // eventSubListener.addListener('channel.ban', (event) => {
    //   console.log('Ban event received:', event);
    // });
    // //evenetSubListener.registerEvent()

    console.log("Listening for ban events...");
  } catch (err) {
    console.error("An error occurred while starting EventSub listener:", err);
  }
};

// Handle SIGINT signal to gracefully stop the listener and exit the process
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await eventSubListener.stop();
  process.exit(0);
});

// Initialize EventSub listener
await initializeEventSub();

export { authProvider, api, eventSubListener };
