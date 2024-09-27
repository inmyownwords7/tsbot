/// <reference path="../types.d.ts" />

import {
  ChatClient,
  ChatCommunitySubInfo,
  ChatMessage,
  ChatSubExtendInfo,
  ChatSubInfo,
  UserNotice,
} from "./index.js";

import { channelsMap } from "./utils/async config.js";
import { authProvider, api } from "./modules/auth.js";
import { userId, DATE_FORMAT, handleMessage } from "./index.js";
import { colors } from "./formatting/chalk.js";
// import { logChatMessage } from "./modules/logger.js";
import { logChatMessage } from './modules/logger.js';

// <reference path="index.d.ts" />
//TODO setup api. Assign env variables. Create a count helper function
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

async function apiEvents(): Promise<void> {
  async function timeout(duration: number, reason: string, user: string) {
    await api.asUser(userId, async (ctx) => {
      try {
        await ctx.moderation.banUser(userId, {
          duration: duration, // Make sure 'number' is defined
          reason: reason, // Make sure 'explanation' is defined
          user: user, // Make sure 'user_Id' is defined
        });
      } catch (error) {
        console.error("Error banning user:", error); // Provide error details
      }
    });
  }

  // Call the timeout function to execute the logic
  await timeout(60, "he is trash", "woordbot");
}

Events();
export {chatClient, apiEvents, bot };
