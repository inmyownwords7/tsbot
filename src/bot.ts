/// <reference path="../types.d.ts" />
// import en from "formatting/messages.json"
// en
import {
  ChatClient
} from "./index.js";
/**@this Maps cannot be used for global exports*/
import {
  channelsMap,
  loadChatUserData,
  saveChatMessageData,
} from "./utils/async config.js";
import { authProvider } from "./modules/auth.js";
import registerChatClientEvents from "./modules/events.js";

// **@chatClient declaration */
/**
 * Description placeholder
 *
 * @type {*}
 */
const chatClient: ChatClient = new ChatClient({
  authProvider,
  channels: Array.from(channelsMap.keys()),
  webSocket: true,
});

/**
 * Description placeholder
 *
 * @type {string[]}
 */
let activeUserGroups: string[] = ["woooordbot"];
/**
 * @returns {string[]
 *}
 * @type {string[]}
 */
let activeUserGroupsIds: string[] = ["439212677", "132881296", "65538724"];
// await extractIdsFromUser(activeUserGroups);

/**
 * Description placeholder
 *
 * @type {MessageMetaData}
 */

/**
 * Description placeholder
 *
 * @param {string} channel
 * @param {string} user
 * @param {string} text
 * @param {ChatMessage} msg
 */

/**
 * Description placeholder
 * @returns {Promise<void>}
 */
async function bot(): Promise<void> {
  try {
    await loadChatUserData();
    registerChatClientEvents(chatClient);
    chatClient.connect(); // Wait for the connection to succeed
  } catch (err) {
    console.error("Failed to connect to Twitch chat:", err);
    return;
  }
}

export async function join(chatClient: ChatClient): Promise<void> {
  chatClient.onJoin((channel, user) => {`${user} ${channel}`});
}
export { chatClient, bot };
