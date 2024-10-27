/// <reference path="../types.d.ts" />
// import en from "formatting/messages.json"
// en
import {
  ChatClient,
  ChatCommunitySubInfo,
  ChatMessage,
  ChatSubExtendInfo,
  ChatSubInfo,
  UserNotice,
  // logChatMessage,
} from "./index.js";
/**@this Maps cannot be used for global exports*/
import {
  channelsMap,
  loadChatUserData,
  saveChatMessageData,
} from "./utils/async config.js";
import { authProvider, api } from "./modules/auth.js";
import { colors } from "./formatting/chalk.js";
import { logChannelMessage } from "./modules/logger.js";
import {
  ChatAnnouncementInfo,
  ChatSubGiftInfo,
  ClearChat,
  ClearMsg,
} from "@twurple/chat";
import { isCommand, setColor } from "./utils/helpers.js";
import { botId, GETDYNAMICDATE } from "./formatting/constants.js";
import {
  HelixBanUserRequest,
  UserIdResolvable,
  HelixBanUser,
  HelixUser,
  UserNameResolvable,
  extractUserName,
  HelixChatUserColor,
  HelixChannelApi,
  HelixChatApi,
  extractUserId,
} from "@twurple/api";
import { getEventMessages } from "./formatting/loadJSON.js";
import registerChatClientEvents from "./modules/events.js";
import { promises } from "dns";
// import { getLocalizedMessages } from "./formatting/loadJSON.js";

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
    console.log("Connected to Twitch chat");
  } catch (err) {
    console.error("Failed to connect to Twitch chat:", err);
    return;
  }
}

export async function join(chatClient: ChatClient): Promise<void> {
  chatClient.onJoin((channel, user) => {
    `${user} ${channel}`;
  });
}
export { chatClient, bot };
