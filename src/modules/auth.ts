// authProviderSetup.ts

import { botId } from "../formatting/constants.js";
import { RefreshingAuthProvider, fs } from "../index.js";
import { EventSubWsListener } from '@twurple/eventsub-ws';
import { ApiClient } from "@twurple/api";

interface AuthConfig {
  clientId: string;
  clientSecret: string;
}

const promises = fs.promises;
const credentials: AuthConfig = {
  clientId: "k3kjal6wl67bmcm0avngpkpnikaseh",
  clientSecret: "ybmuwh1pqyk7alcwchyyqwydvd8jjj",
};

const userId: string = "132881296";
const authProvider = new RefreshingAuthProvider(credentials);

const initializeAuthProvider = async () => {
  const tokenData = JSON.parse(
    await promises.readFile(`./tokens.${botId}.json`, "utf-8")
  );

  // Add token with required intents: chat, api, and eventsub
  await authProvider.addUserForToken(tokenData, ['chat', 'api', 'eventsub']);

  // Listen for token refreshes and update the token file
  authProvider.onRefresh(async (userId, newTokenData) => {
    await promises.writeFile(
      `./tokens.${userId}.json`,
      JSON.stringify(newTokenData, null, 4),
      "utf-8"
    );
  });
};

// Initialize authProvider first
await initializeAuthProvider()
  .then(() => console.log("AuthProvider initialized successfully"))
  .catch((err) => {
    console.error("An error occurred during initialization:", err);
    process.exit(1);
  });

// Set up the ApiClient with the initialized authProvider
const api = new ApiClient({ authProvider });

// Set up the EventSub WebSocket listener with the ApiClient
const eventSubListener = new EventSubWsListener({ apiClient: api,
  url: 'ws://127.0.0.1:8080/ws' 
})

// Function to start the listener and subscribe to the ban event
const initializeEventSub = async () => {
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

// Initialize EventSub listener
await initializeEventSub();

export { authProvider, api, eventSubListener };
