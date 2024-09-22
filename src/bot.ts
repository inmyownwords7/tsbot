import {
  ChatClient,
  ChatCommunitySubInfo,
  ChatMessage,
  ChatSubExtendInfo,
  ChatSubInfo,
  UserNotice,
} from "@twurple/chat";
import { authProvider } from "./modules/auth.js";
import { channelsMap } from "./utils/async config.js";
import { colors } from "./formatting/chalk.js";
import { DATE_FORMAT } from "./formatting/constants.js";
import { logChatMessage } from "./modules/logger.js";
import { api } from "./modules/auth.js";
// <reference path="index.d.ts" />
//TODO setup api. Assign env variables. Create a count helper function
// **@chatClient declaration */
/**
 * Description placeholder
 *
 * @type {*}
 */
export const chatClient: ChatClient = new ChatClient({
  authProvider,
  channels: Array.from(channelsMap.keys()),
  webSocket: true,
});

/**
 * Description placeholder
 *
 * @type {string[]}
 */
let GroupArray: string[] = [];
/**
 * @returns {string[]
 *}
 * @type {string[]}
 */
let GroupArrayIds: string[] = [];
// await extractIdsFromUser(GroupArray);

/**
 * Description placeholder
 *
 * @type {MessageMetaData}
 */
type MessageMetaData = {
  isMod?: boolean; // Assuming this should be a boolean
  isVip?: boolean; // Assuming this should be a boolean
  isBroadcaster?: boolean; // Assuming this should be a boolean
  isParty?: boolean; // Assuming this should be a boolean
  isStaff?: boolean; // Assuming this should be a boolean
  isDeputy?: boolean; // Assuming this should be a boolean
  isEntitled?: boolean; // Assuming this should be a boolean
  isPermitted?: boolean; // Assuming this should be a boolean
  channelId?: string; // Required string
  userId?: string; // Required string
};

/**
 * Description placeholder
 *
 * @param {string} channel
 * @param {string} user
 * @param {string} text
 * @param {ChatMessage} msg
 */
export function handleMessage(
  channel: string,
  user: string,
  text: string,
  msg: ChatMessage
): void {
  const messageMetaData: MessageMetaData = {
    isMod: msg.userInfo.isMod || false, // Handles falsy values other than null/undefined
    isVip: msg.userInfo.isVip || false,
    isBroadcaster: msg.userInfo.isBroadcaster || false,
    isParty:
      GroupArray.includes(user) ||
      GroupArrayIds.includes(msg.userInfo.userId || ""),
    isStaff: msg.userInfo.isMod || false || msg.userInfo.isBroadcaster || false,
    isDeputy:
      GroupArray.includes(user) ||
      GroupArrayIds.includes(msg.userInfo.userId || ""),
    isEntitled:
      msg.userInfo.isMod ||
      false ||
      msg.userInfo.isVip ||
      false ||
      msg.userInfo.isBroadcaster ||
      false,
    isPermitted:
      (msg.userInfo.isMod || false || msg.userInfo.isBroadcaster || false) &&
      GroupArray.includes(user),
    channelId: msg.channelId || "", // Handles other falsy values as well
    userId: msg.userInfo.userId || "",
  };

  const messageHandlers: Array<
    (
      channel: string,
      user: string,
      text: string,
      msg: ChatMessage,
      messageMetaData: MessageMetaData
    ) => void
    //**@chatHandlers are added here.*/
  > = [commandHandler];

  for (const handler of messageHandlers) {
    handler(channel, user, text, msg, messageMetaData);
  }

  function commandHandler(
    channel: string,
    user: string,
    text: string,
    msg: ChatMessage,
    messageMetaData: MessageMetaData
  ) {
    const command = text.split(" ")[0];
    if (!command.startsWith("!")) {
      return; // Ignore messages that aren't commands
    }

    const commandHandlers: Record<
      string,
      (channel: string, user: string, messageMetaData: MessageMetaData) => void
    > = {
      "!quit": handleQuitCommand,
      "!help": handleHelpCommand,
      // Add more commands here
    };

    const handler = commandHandlers[command];
    if (handler) {
      handler(channel, user, messageMetaData);
    } else {
      console.log(`Unknown command: ${user}: ${command}`);
    }
  }

  function handleQuitCommand(
    channel: string,
    user: string,
    messageMetaData: MessageMetaData
  ) {
    if (messageMetaData.isMod && channel === "iwdominate") {
      chatClient.quit();
      console.log(`${user} has quit the chat.`);
    }
  }

  function handleHelpCommand(channel: string, user: string) {
    chatClient.say(channel, "Available commands: !quit, !help, ...");
  }
  logChatMessage(channel, user, text, messageMetaData);
}

/**
 * Description placeholder
 * @returns {Promise<void>}
 */
export async function bot(): Promise<void> {
  try {
    chatClient.connect(); // Wait for the connection to succeed
    console.log("Connected to Twitch chat");
  } catch (err) {
    console.error("Failed to connect to Twitch chat:", err);
  }

  chatClient.onMessage(handleMessage);
}
/**
 * Description placeholder
 */
function Events(): void {
  chatClient.onJoin((channel: string, user: string): void => {
    console.log(
      colors.defaultColor(`${DATE_FORMAT}: ${user} has joined ${channel}`)
    );
  });
  const giftCounts = new Map<string, number>();
  type SubscriptionType = "new" | "extend" | "resub" | "community";

  const handleSubscription = (subscriptionType: SubscriptionType) => {
    return (
      channel: string,
      user: string,
      subInfo: ChatSubInfo | ChatSubExtendInfo | ChatCommunitySubInfo,
      msg: UserNotice
    ): void => {
      const channelConfig = channelsMap.get(channel);

      if (channelConfig && channelConfig.shouldThankSubscription) {
        switch (subscriptionType) {
          case "new":
            if (isChatSubInfo(subInfo)) {
              console.log(
                colors.defaultColor(
                  `${DATE_FORMAT}: ${user} has subscribed to ${channel} for ${subInfo.months} months`
                )
              );
              chatClient.say(
                channel,
                `${user} has just subscribed for ${subInfo.months} months !`
              );
            }
            break;

          case "extend":
            if (isChatSubExtendInfo(subInfo)) {
              console.log(
                colors.defaultColor(
                  `${DATE_FORMAT}: ${user} has extended their subscription to ${channel} for ${subInfo.months} months`
                )
              );
            }
            break;

          case "resub":
            if (isChatSubInfo(subInfo)) {
              chatClient.say(
                channel,
                `Thanks to @${user} for resubscribing for a total of ${subInfo.months} months!`
              );
            }
            break;

          case "community":
            if (isChatCommunitySubInfo(subInfo)) {
              const previousGiftCount = giftCounts.get(user) ?? 0;
              giftCounts.set(user, previousGiftCount + subInfo.count);
              chatClient.say(
                channel,
                `Thanks ${user} for gifting ${subInfo.count} subs to the community!`
              );
            }
            break;

          default:
            console.error("Unknown subscription type");
        }
      }
    };
  };

  // Type guard functions
  function isChatSubInfo(info: any): info is ChatSubInfo {
    return (info as ChatSubInfo).months !== undefined;
  }

  function isChatSubExtendInfo(info: any): info is ChatSubExtendInfo {
    return (info as ChatSubExtendInfo).months !== undefined;
  }

  function isChatCommunitySubInfo(info: any): info is ChatCommunitySubInfo {
    return (info as ChatCommunitySubInfo).count !== undefined;
  }

  // Setting up event handlers
  chatClient.onSub(handleSubscription("new"));
  chatClient.onSubExtend(handleSubscription("extend"));
  chatClient.onResub(handleSubscription("resub"));
  chatClient.onCommunitySub(handleSubscription("community"));
}
Events();
