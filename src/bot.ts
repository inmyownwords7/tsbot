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
import { botId, getDynamicDate } from "./formatting/constants.js";
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
    registerChatClientEvents(chatClient)
    chatClient.connect(); // Wait for the connection to succeed
    console.log("Connected to Twitch chat");
  } catch (err) {
    console.error("Failed to connect to Twitch chat:", err);
    return;
  }

//   // chatClient.onMessage(async (channel, user, text, msg) => {
//   //   let {
//   //     isFounder,
//   //     isVip,
//   //     isMod,
//   //     userId,
//   //     isSubscriber,
//   //     isBroadcaster,
//   //     color,
//   //   } = msg.userInfo;
//   //   let { channelId } = msg;
//   //   logChannelMessage(channel, user, text, msg);

//   //   const messageMetaData: userData = {
//   //     isFounder: isFounder || false,
//   //     channelId: channelId || undefined,
//   //     isMod: isMod || false,
//   //     isVip: isVip || false,
//   //     isBroadcaster: isBroadcaster || false,
//   //     isSubscriber: isSubscriber || false,
//   //     userId: userId || undefined,
//   //     userName: user,
//   //     color: color || undefined,
//   //     isDeputy: activeUserGroupsIds.includes(userId),
//   //   };

//   //   if (messageMetaData.isDeputy) {
//   //     console.log(`${user} is a deputy`);
//   //   }
//   //   await timeoutHandler(
//   //     channel,
//   //     user,
//   //     text,
//   //     msg,
//   //     { duration: 600, reason: "test", user: user },
//   //     messageMetaData
//   //   );
//   //   if (messageMetaData.isMod && text === "!timeout") {
//   //     // banUser(channel, { duration: 600, reason: "test", user: userId });
//   //     // console.log(`${user} is a moderator`);
//   //   }

//   //   await saveChatMessageData(messageMetaData);
//   // });

//   const eventHandlers = [
//     subEvents,
//     connectionEvents,
//     channelEvents,
//     // moderatorEvent,
//   ];

//   for (const handler of eventHandlers) {
//     await handler();
//   }
}
/**
 * Description placeholder
 */
async function subEvents(): Promise<void> {
  const giftCounts = new Map<string | undefined, number>();
  const handleSubscription = (subscriptionType: SubscriptionType) => {
    return (
      channel: string,
      user: string,
      subInfo:
        | ChatSubInfo
        | ChatSubExtendInfo
        | ChatCommunitySubInfo
        | ChatSubInfo
        | ChatSubGiftInfo,
      msg: UserNotice
    ): void => {
      try {
        const channelConfig = channelsMap.get(channel);

        if (channelConfig && channelConfig.shouldThankSubscription) {
          switch (subscriptionType) {
            case "new":
              if (isChatSubInfo(subInfo)) {
                console.log(
                  colors.defaultColor(
                    `${getDynamicDate()}: ${user} has subscribed to ${channel} for ${
                      subInfo.months
                    } months`
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
                    `${getDynamicDate()}: ${user} has extended their subscription to ${channel} for ${
                      subInfo.months
                    } months`
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

            case "subgift":
              if (isChatSubGiftInfo(subInfo)) {
                const user = subInfo.gifter;
                const previousGiftCount = giftCounts.get(user) ?? 0;
                if (previousGiftCount > 0) {
                  giftCounts.set(user, previousGiftCount - 1);
                } else {
                  chatClient.say(
                    channel,
                    `Thanks ${user} for gifting a sub to ${subInfo.displayName}!`
                  );
                }
              }
              break;

            default:
              console.error("Unknown subscription type");
          }
        }
      } catch (error) {
        console.error("Error handling subscription event:", error);
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

  function isChatSubGiftInfo(info: any): info is ChatSubGiftInfo {
    return (info as ChatSubGiftInfo).gifter !== undefined;
  }
  try {
    // Setting up event handlers
    chatClient.onSub(handleSubscription("new"));
    chatClient.onSubExtend(handleSubscription("extend"));
    chatClient.onResub(handleSubscription("resub"));
    chatClient.onCommunitySub(handleSubscription("community"));
    chatClient.onSubGift(handleSubscription("subgift"));
  } catch (e) {
    console.error("Error setting up subscription event handlers:", e);
  }
}

// Call the timeout function to execute the logic
/**
 * Description placeholder
 * @Date 1:50:37 pm
 *
 * @async
 * @returns {Promise<void>}
 */
async function connectionEvents(): Promise<void> {
  chatClient.onJoin((channel: string, user: string): void => {
    console.log(
      colors.defaultColor(`${getDynamicDate()}: ${user} has joined ${channel}`)
    );
  });

  chatClient.onDisconnect((manually: boolean, reason: Error | undefined) => {
    console.log("Disconnected to Twitch chat");
  });

  chatClient.onConnect(() => {
    /*
    @disabled */
    // console.log("Connected to Twitch");
  });

  chatClient.onAuthenticationSuccess(() => {});

  chatClient.onAuthenticationFailure((error) => {
    console.error("Authentication failed:", error);
  });
}

/**
 * Description placeholder
 * @Date 1:50:37 pm
 *
 * @async
 * @returns {*}
 */
// async function moderatorEvent(): Promise<void> {
 
//   chatClient.onBan((channel: string, user: string, msg: ClearChat) => {
//     // const message = getLocalizedMessages('ban_message', { user, channel });
//     // console.log(message);
//     console.log(`${user} is banned from ${channel}`);
//   });

//   chatClient.onMessageRemove(
//     (channel: string, messageId: string, msg: ClearMsg) => {
//       console.log("");
//     }
//   );

//   chatClient.onTimeout(
//     (channel: string, user: string, duration: number, msg: ClearChat) => {
//       console.log(`${channel}: ${user} was timed out for ${duration} seconds`);
//     }
//   );

//   chatClient.onAnnouncement(
//     (
//       channel: string,
//       user: string,
//       announcementInfo: ChatAnnouncementInfo,
//       msg: UserNotice
//     ) => {
//       console.log("");
//     }
//   );

//   chatClient.onAction(
//     (channel: string, user: string, text: string, msg: ChatMessage) => {
//       console.log("");
//     }
//   );
// }
/**
 * Description placeholder
 * @Date 1:50:37 pm
 *
 * @async
 * @returns {*}
 */
async function channelEvents(): Promise<void> {
  chatClient.onChatClear((channel: string, msg: ClearChat) => {
    console.log("");
  });

  chatClient.onSubsOnly((channel: string, enabled: boolean) => {
    console.log("");
  });

  chatClient.onEmoteOnly((channel: string, enabled: boolean) => {
    console.log("");
  });

  chatClient.onFollowersOnly(
    (channel: string, enabled: boolean, delay?: number | undefined) => {
      console.log("");
    }
  );

  chatClient.onPart((channel: string, user: string) => {
    console.log("");
  });

  chatClient.onSlow(
    (channel: string, enabled: boolean, delay?: number | undefined) => {
      console.log("");
    }
  );

  chatClient.onUniqueChat((channel: string, enabled: boolean) => {
    console.log("");
  });
}

/**
 * Description placeholder
 * @Date 1:50:37 pm
 *
 * @async
 * @param {*} user
 * @returns {Promise<string | false | undefined | UserIdResolvable>}
 */

async function extractIdFromUser(
  user: string
): Promise<string | false | undefined | UserIdResolvable> {
  user = user.replace("@", "");
  try {
    if (!user) {
      return false;
    } else if (user && api) {
      const userResult = await api.users.getUserByName(user);
      if (!userResult) {
        return false;
      } else {
        return userResult.id;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

extractUserFromIds(activeUserGroupsIds);
/**
 * Description placeholder
 * @date 1:13:17 pm
 *
 * @async
 * @param {(string | string[])} userId
 * @returns {Promise<string | string[] | false>}
 */
async function extractUserFromIds(
  userId: string | string[]
): Promise<string | string[] | false> {
  try {
    if (Array.isArray(userId)) {
      // Handle case where user is an array of strings (user IDs)
      const results = await Promise.all(
        userId.map(async (u) => {
          u = u.replace("@", "");
          if (activeUserGroupsIds.includes(u)) {
            console.log(u)
            return u;
          }
          if (!u || !api) {
            return false;
          }
          const userResult = await api.users.getUserById(u);
          console.log(userResult)
          return userResult ? userResult.id : false;
        })
      );

      // Filter out any 'false' values from the results
      console.log(results)
      return results.filter((result) => result !== false) as string[];
    } else {
      // Handle case where user is a single string (user ID)
      userId = userId.replace("@", "");

      if (activeUserGroupsIds.includes(userId)) {
        console.log(userId)
        return userId;
      }
      if (!userId || !api) {
        return false;
      }
      const userResult = await api.users.getUserById(userId);
      console.log(userResult)
      return userResult ? userResult.id : false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
/**
 * Description placeholder
 * @Date 1:50:37 pm
 *
 * @async
 * @param {UserIdResolvable} channel
 * @param {HelixBanUserRequest} data
 * @returns {Promise<boolean>}
 */
async function banUser(
  channel: string,
  data: HelixBanUserRequest
): Promise<boolean> {
  console.log("params:", channel, data.duration, data.reason, data.user);
  // const { duration: number, reason: string, user: UserIdResolvable } = data;
  // console.log(`${msg.userInfo.userId} this is the id of the speaker.`);
  const twitchChannel: HelixUser | null = await api.users.getUserByName(
    channel
  );
  
  twitchChannel?.id;
  try {
    // Check if user is valid
    if (!data.user || typeof data.user !== "string") {
      console.error("Invalid user provided for ban.");
      return false;
    }

    // Extract user ID
    const userId = await extractIdFromUser(data.user);
    console.log("ids:", userId);
    if (!userId) {
      console.error(`User ID could not be found for user: ${data.user}`);
      return false;
    }
    const reasoning: string = data.reason ?? "no explanation provided";
    // Default ban duration to 600 seconds if undefined
    const banDuration: number | undefined = data.duration ?? 600; // Default to 600 seconds if `number` is undefined

    // Call the API to ban the user
    if (api && twitchChannel) {
      // console.log(`id is: `)
      await api.asUser(botId, async (ctx) =>
        ctx.moderation.banUser(twitchChannel.id, {
          duration: banDuration,
          reason: reasoning,
          user: userId,
        })
      );
      console.log(
        `User ${data.user} was successfully banned for ${data.duration} seconds.`
      );
      return true;
    } else {
      console.error("API instance is not available.");
      return false;
    }
  } catch (error) {
    console.error(`Error while banning user ${data.user}:`, error);
    return false;
  }
}

/**
 * Description placeholder
 * @Date 1:50:37 pm
 *
 * @description this returns
 * @async
 * @param {string} channel
 * @param {UserIdResolvable} user
 * @param {string} text
 * @param {ChatMessage} msg
 * @param {HelixBanUserRequest} data
 * @param {MessageMetaData} messageMetaData
 * @returns {*}
 */
export async function timeoutHandler(
  channel: string,
  caller: UserIdResolvable,
  text: string,
  msg: ChatMessage,
  data: HelixBanUserRequest,
  messageMetaData: MessageMetaData
): Promise<void> {
  const duration = data.duration ?? 600;
  let user = data.user;
  const isTimeoutCommand = isCommand("!timeout", text); // Check if it's a timeout command
  // console.log(isTimeoutCommand + " line 472 bot.ts");
  try {
    if (isTimeoutCommand) {
      // Check if the user has permissions (staff, party, or deputy)
      if (
        messageMetaData.isStaff ||
        messageMetaData.isParty ||
        messageMetaData.isDeputy
      ) {
        // Assuming isCommand returns true/false, extract the arguments from `text`
        const args: string[] = text.split(" ");

        // console.log("These are the arguments: line 484 bot.ts", args);
        if (args.length < 2) {
          console.error("No user specified for timeout. line 486 bot.ts");
          return; // Exit the function if no user is provided
        }
        // Remove '@' from the user being timed out (usually @username format in chat)
        args[1] = args[1].replace(/@/g, "");
        // args[1] is the username
        const reason = args.slice(3).join(" "); // Combine remaining arguments for the reason

        // console.log("Timeout args:", channel, caller, duration, reason, args[1]);

        // Check if the user is not in the immune groups and proceed to timeout
        if (
          !activeUserGroups.includes(args[1].toLowerCase())
          // || !activeUserGroupsIds.includes(msg.userInfo.userId)
        ) {
          // console.log(channel, duration, reason, args[1])
          // console.log(data)
          user = args[1];
          // Parse timeout duration; default to 600 if args[2] is not a valid number
          banUser(channel, { duration, reason, user });
        } else {
          console.log(
            channel + `${args[1].toLowerCase()} is immune from deputy timeouts.`
          );
          chatClient.say(
            channel,
            `${args[1].toLowerCase()} is immune from deputy timeouts.`
          );
        }
      }
    }
  } catch (err) {
    console.error("Error in timeoutHandler:", err);
  }
}

/**
 * Description placeholder
 * @date 1:13:17 pm
 *
 * @async
 * @param {(string | UserIdResolvable)} user
 * @returns {Promise<undefined | string | null>}
 */
async function getUserColor(
  user: string | UserIdResolvable
): Promise<undefined | string | null> {
  const color = await api.chat.getColorForUser(user);
  // console.log("Getting color for:", user);
  return color;
}
export { chatClient, bot, extractIdFromUser };
