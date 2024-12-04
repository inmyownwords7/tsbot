import { EventEmitter } from "events";
import {
  ChatClient
} from "@twurple/chat";
import { logChannelMessage, systemLogger } from "./logger.js";
import { channelsMap } from "../utils/async config.js";
import { BOT_ID, getTimeFormat } from "../formatting/constants.js";
import { eventSubListener } from "./auth.js";
import { foreignLanguageHandler, timeoutHandler } from "../handlers/commandsHandler.js";
/**
 * Description placeholder
 * @date 1:37:46 pm
 * This will be used for permission based commands. 
 * @type {UserData}
 */
export let commandMessageData: UserData = {
  isMod: false,
  isVip: false,
  isBroadcaster: false,
  isSubscriber: false,
  userName: "",
  userId: "",
  isFounder: false,
  channelId: "",
  color: ""
}
/**
 * Description placeholder
 * @date 10:40:47 am
 *
 * @type {*}
 */
const event: EventEmitter = new EventEmitter({ captureRejections: true });
/**
 * Description placeholder
 * @date 10:40:47 am
 *
 * @type {string[]}
 */


// Event handlers without getEventMessages
/**
 * Events are received from the event.emit()
 * chat
 * @date 10:40:47 am
 *
 * @async
 * @param {EventEmitter} event
 * @returns {Promise<void>}
 */
async function eventHandlers(event: EventEmitter): Promise<void> {
  event.on("message", async ({ channel, user, text, msg }: MessageEvent) => {
    const { color, userId, isBroadcaster, isMod, isVip, isSubscriber, isFounder } = msg.userInfo;
    const { channelId } = msg;
    const metadataParts: string[] = [];

    try {
      // Reset shared state
      // metadataParts.length = 0; // Clear the array
      commandMessageData = {
        isMod,
        isVip,
        isBroadcaster,
        isSubscriber,
        userName: user,
        userId,
        isFounder,
        channelId: channelId || undefined,
        color: color || undefined
      };

      try {
        await logChannelMessage(channel, user, text, msg);
      } catch (error) {
        console.error(`Error in logChannelMessage:`, error);
      }

      try {
        await foreignLanguageHandler(channel, user, text, msg);
      } catch (error) {
        console.error(`Error in foreignLanguageHandler:`, error);
      }
    } catch (error) {
      console.error(`Error processing message from ${user} in ${channel}:`, error);
    }

    // Filter messages for commands
    if (!text.startsWith("!")) return; // Ignore non-command messages

    const [command, ...args] = text.substring(1).split(" "); // Extract command and args
    switch (command) {
      case "timeout":
        await timeoutHandler(channel, text, user, msg, commandMessageData);
        break;
      default:
        console.log(`Unrecognized command: ${command}`);
        break;
    }

    const roles = [
      { role: "self", condition: userId === BOT_ID },
      { role: "founder", condition: isFounder },
      { role: "broadcaster", condition: isBroadcaster },
      { role: "moderator", condition: isMod },
      { role: "vip", condition: isVip },
      { role: "subscriber", condition: isSubscriber },
      { role: "pleb", condition: true },
    ];
   
    for (const { role, condition } of roles) {
      if (condition) {
        metadataParts.push(role);
        break; // Only assign the first matching role
      }
    }
    // Handlers for logging and foreign language
  });

  event.on("ban", async ({ channel, user, msg }: BanEvent) => {
    console.log(`User ${user} is banned from ${channel}`);
  });

  event.on("timeout", async ({ channel, user, duration, msg: ClearChat }: TimeoutEvent) => {
    console.log(`User ${user} has been timed out in ${channel} for ${duration} seconds`);
  });

  event.on("messageRemove", async ({ channel, messageId, msg }: MessageRemoveEvent) => {
    console.log(`Message with ID ${messageId} removed from ${channel}`);
  });

  event.on("announcement", async ({ channel, user, announcementInfo, msg }: AnnouncementEvent) => {
    console.log(`Announcement from ${user} in ${channel}: ${announcementInfo}`);
  });

  event.on("slowmode", async ({ channel, enabled, delay }) => {
    console.log(`Slow mode is ${enabled ? "enabled" : "disabled"} in ${channel} with a delay of ${delay} seconds`);
  });

  event.on("uniquemode", async ({ channel, enabled }) => {
    console.log(`Unique chat mode is ${enabled ? "enabled" : "disabled"} in ${channel}`);
  });

  event.on("bitsBadgeUpgrade", async ({ channel, user, upgradeInfo, msg }) => {
    console.log(`${user} upgraded bits badge in ${channel}: ${upgradeInfo}`);
  });

  event.on("clear", async ({ channel, msg }) => {
    console.log(`Chat cleared in ${channel}`);
  });

  event.on("noPermission", async ({ channel, text }) => {
    console.log(`No permission message in ${channel}: ${text}`);
  });

  event.on("raid", async ({ channel, user, raidInfo, msg }) => {
    console.log(`User ${user} is raiding ${channel} with ${raidInfo}`);
  });

  event.on("raidCancel", async ({ channel, msg }) => {
    console.log(`Raid canceled in ${channel}`);
  });

  event.on("rewardGift", async ({ channel, user, rewardGiftInfo, msg }) => {
    console.log(`Reward gift from ${user} in ${channel}: ${rewardGiftInfo}`);
  });

  event.on("ritual", async ({ channel, user, ritualInfo, msg }) => {
    console.log(`Ritual in ${channel} by ${user}: ${ritualInfo}`);
  });

  event.on("whisper", async ({ user, text, msg }) => {
    console.log(`Whisper from ${user}: ${text}`);
  });

  event.on("onTokenFailure", async ({ err }) => {
    console.error(`Token failure: ${err}`);
  });

  event.on("onTokenSuccess", async ({ token }) => {
    console.log(`Token success: ${token}`);
  });

  event.on("join", ({ channel, user }) => {
    // console.log(`${getTimeFormat()} ${user} has joined ${channel}`);
    systemLogger.info(`${user} has joined ${channel}`);
  });
}

async function channelEventHandlers(event: EventEmitter) {
  event.on("followersOnly", ({ channel, enabled, delay }) => {

  })
}
/**
 * Description placeholder
 * @date 10:29:02 am
 *
 * @async
 * @param {EventEmitter} event
 * @returns {Promise<void>}
 */
async function eventSubscriptionHandlers(event: EventEmitter): Promise<void> {
  const giftCounts: Map<string, number> = new Map();
  event.on("onSub", async ({ channel, user, subInfo }: SubEvent) => {
    const months: number = subInfo?.months ?? 0;
    const isPrime: boolean = subInfo?.isPrime ?? false;
    const streak: number | undefined = subInfo?.streak;

    // Message Templates
    const generateMessage = (type: string, user: string, months: number, streak?: number) => {
      const baseText = `Thank you @${user} for subscribing to the elderly iwdOld ${channel}`;
      switch (type) {
        case "prime":
          return `${baseText} with a Prime sub for ${months} month${months > 1 ? "s" : ""}!`;
        case "streakPrime":
          return `${baseText} with a streak Prime sub for ${streak} month${streak! > 1 ? "s" : ""}! (Total: ${months} month${months > 1 ? "s" : ""})`;
        case "normal":
          return `${baseText} for ${months} month${months > 1 ? "s" : ""}!`;
        case "streakNormal":
          return `${baseText} with a streak of ${streak} month${streak! > 1 ? "s" : ""}! (Total: ${months} month${months > 1 ? "s" : ""})`;
        case "zeroMonthsPrime":
          return `${baseText} with a Prime sub! Your support means a lot!`;
        case "zeroMonthsNormal":
          return `${baseText}! Your support means a lot!`;
        default:
          return `${baseText}!`;
      }
    };

    // Determine Message Type
    let messageType: string;

    if (months === 0) {
      messageType = isPrime ? "zeroMonthsPrime" : "zeroMonthsNormal";
    } else if (isPrime) {
      messageType = streak ? "streakPrime" : "prime";
    } else {
      messageType = streak ? "streakNormal" : "normal";
    }

    const message = generateMessage(messageType, user, months, streak);

    // Log and Send Message
    console.log(`[Subscription] ${user} subscribed in ${channel}: ${message}`);
    // chatClient.say(channel, message);
  });


  // Helper function to update gift counts
  const updateGiftCount = (gifter: string, count: number) => {
    const previousCount = giftCounts.get(gifter) ?? 0;
    const newCount = previousCount + count;
    giftCounts.set(gifter, newCount);
    return newCount;
  };

  // Event: Individual Sub Gift
  event.on("onSubGift", async ({ channel, user, subGiftInfo, msg }: SubGiftEvent) => {
    const gifter = user || "Anonymous";
    const recipient = subGiftInfo?.displayName || "unknown recipient";

    // Log and send message
    console.log(`[SubGift] ${gifter} gifted a subscription to ${recipient} in ${channel}.`);
    // chatClient.say(
    //   channel,
    //   `Thanks ${gifter} for gifting a sub to ${recipient} and supporting the elderly iwdOld!`
    // );

    // Update gift count (decrement if necessary)
    const previousGiftCount = giftCounts.get(gifter) ?? 0;
    if (previousGiftCount > 0) {
      giftCounts.set(gifter, previousGiftCount - 1);
    }
  });

  // Event: Community Sub Gift
  event.on("onCommunitySub", async ({ channel, gifterName, giftInfo }: CommunitySubEvent) => {
    const totalGifts = updateGiftCount(gifterName, giftInfo.count);

    // Log and send message
    console.log(`[CommunitySub] ${gifterName} gifted ${giftInfo.count} subs in ${channel}.`);
    // chatClient.say(
    //   channel,
    //   `Thank you @${gifterName} for gifting ${giftInfo.count} subs to support the elderly iwdOld! Total gifted subs: ${totalGifts}.`
    // );
  });


  event.on("onResub", async ({ channel, user, subInfo, msg }: ResubEvent) => {
    const months: number = subInfo?.months ?? 0;
    const isPrime: boolean = subInfo?.isPrime ?? false;
    const streak: number | undefined = subInfo?.streak;

    // Helper function to generate messages
    const generateMessage = (type: string, user: string, months: number, streak?: number): string => {
      const baseText = `Thank you @${user} for subscribing to the elderly iwdOld ${channel}`;
      switch (type) {
        case "prime":
          return `${baseText} with a Prime sub for ${months} month${months > 1 ? "s" : ""}!`;
        case "streakPrime":
          return `${baseText} with a streak Prime sub for ${streak} month${streak! > 1 ? "s" : ""}! (Total: ${months} month${months > 1 ? "s" : ""})`;
        case "normal":
          return `${baseText} for ${months} month${months > 1 ? "s" : ""}!`;
        case "streakNormal":
          return `${baseText} with a streak of ${streak} month${streak! > 1 ? "s" : ""}! (Total: ${months} month${months > 1 ? "s" : ""})`;
        case "zeroMonthsPrime":
          return `${baseText} with a Prime sub! Your support means a lot!`;
        case "zeroMonthsNormal":
          return `${baseText}! Your support means a lot!`;
        default:
          return `${baseText}!`;
      }
    };

    // Determine message type
    let messageType: string;
    if (months === 0) {
      messageType = isPrime ? "zeroMonthsPrime" : "zeroMonthsNormal";
    } else if (isPrime) {
      messageType = streak ? "streakPrime" : "prime";
    } else {
      messageType = streak ? "streakNormal" : "normal";
    }

    // Generate message
    const message = generateMessage(messageType, user, months, streak);

    // Log and send the message
    console.log(`[Resubscription] ${user} in ${channel}: ${message}`);
    // chatClient.say(channel, message);
  });
}


// Register ChatClient Events
/**
 * Description placeholder
 * @date 10:40:47 am
 *
 * @async
 * @param {ChatClient} chatClient
 * @returns {*}
 */
async function registerChatClientEvents(chatClient: ChatClient): Promise<void> {
  chatClient.onMessage((channel, user, text, msg) => {
    event.emit("message", { channel, user, text, msg });
  });

  chatClient.onBan((channel, user, msg) => {
    event.emit("ban", { channel, user, msg });
  });

  chatClient.onMessageRemove((channel, messageId, msg) => {
    event.emit("messageRemove", { channel, messageId, msg });
  });

  chatClient.onTimeout((channel, user, duration, msg) => {
    event.emit("timeout", { channel, user, duration, msg });
  });

  chatClient.onAnnouncement((channel, user, announcementInfo, msg) => {
    event.emit("announcement", { channel, user, announcementInfo, msg });
  });

  chatClient.onAction((channel, user, text, msg) => {
    event.emit("action", { channel, user, text, msg });
  });

  // Call other event functions
  await connectionEvents(chatClient);
  await subEvents(chatClient);
  await channelEvents(chatClient);
  await eventHandlers(event);
  await eventSubscriptionHandlers(event);
}

/**
 * Description placeholder
 * @date 10:40:47 am
 *
 * @async
 * @param {ChatClient} chatClient
 * @returns {Promise<void>}
 */
async function connectionEvents(chatClient: ChatClient): Promise<void> {
  chatClient.onJoin((channel, user) => {
    event.emit("join", { channel, user });
  });

  chatClient.onDisconnect(() => {
    event.emit("disconnect")
    console.log("Disconnected from Twitch");
  });

  chatClient.onConnect(() => {
    event.emit("connect")
  });

  chatClient.onPart((channel, user) => {
    event.emit("part", { channel, user });
    console.log(`${user} has left ${channel}`);
  });
}

/**
 * Description placeholder
 * @date 10:40:46 am
 *
 * @async
 * @param {ChatClient} chatClient
 * @returns {Promise<void>}
 */
async function subEvents(chatClient: ChatClient): Promise<void> {
  /**
   * @description "subInfo.count" = "total count of gifts"
   * @description "subInfo.streak" = "is there a streak or not with a number"
   * @description "subInfo.isPrime" = "is it a prime sub?"
   */

  let giftCounts: Map<string, undefined | number> = new Map();
  chatClient.onSub((channel, user, subInfo, msg) => {
    console.log(`onSub event triggered for user: ${user} in channel: ${channel}`);
    const isSubscribingEnabled: Boolean = channelsMap.get(channel)?.shouldThankSubscription ?? false
    if (isSubscribingEnabled) {
      event.emit("onSub", { channel, user, subInfo, msg });
    } else {
      console.log(`${user} subscribed in ${channel}: for ${subInfo.months} month`)
    }

  });

  chatClient.onResub((channel, user, subInfo, msg) => {
    console.log(`onSub event triggered for user: ${user} in channel: ${channel}`);
    const isSubscribingEnabled: Boolean = channelsMap.get(channel)?.shouldThankSubscription ?? false
    if (isSubscribingEnabled) {
      event.emit("onResub", { channel, user, subInfo, msg });
    } else {
      console.log(`${user} subscribed ${subInfo.isPrime} in ${channel}: for ${subInfo.months} month`)
    }
  });

  chatClient.onSubGift((channel, user, subInfo, msg) => {
    const isSubscribingEnabled: Boolean = channelsMap.get(channel)?.shouldThankSubscription ?? false
    if (isSubscribingEnabled) {
      event.emit("onSubGift", { channel, user, subInfo, msg });
    } else {
      console.log(`${user} gifted a sub to ${subInfo.displayName} in ${channel}`)
    }
  });

  chatClient.onCommunitySub((channel, user, subInfo, msg) => {
    let gifter
    console.log(`onSub event triggered for user: ${user} in channel: ${channel}`);
    const isSubscribingEnabled: Boolean = channelsMap.get(channel)?.shouldThankSubscription ?? false

    if (isSubscribingEnabled) {
      event.emit("onCommunitySub", { channel, user, subInfo, msg, gifter, giftCounts });
    } else {
      console.log(`${gifter} gifted a sub to ${user} in ${channel}`)
    }
  });
}

/**
 * Description placeholder
 * @date 10:40:46 am
 *
 * @async
 * @param {ChatClient} chatClient
 * @returns {Promise<void>}
 */
async function channelEvents(chatClient: ChatClient): Promise<void> {
  chatClient.onChatClear((channel, msg) => {
    event.emit("clear", { channel, msg });
  });

  chatClient.onSubsOnly((channel, enabled) => {
    event.emit("subsOnly", { channel, enabled })
    console.log(`Sub-only mode is ${enabled ? "enabled" : "disabled"} in ${channel}`);
  });

  chatClient.onEmoteOnly((channel, enabled) => {
    event.emit("emotesOnly", enabled)
    console.log(`Emote-only mode is ${enabled ? "enabled" : "disabled"} in ${channel}`);
  });

  chatClient.onFollowersOnly((channel, enabled, delay) => {
    event.emit("followersOnly", { channel, enabled, delay })
    console.log(`Followers-only mode is ${enabled ? "enabled" : "disabled"} in ${channel} with delay ${delay}`);
  });

  chatClient.onPart((channel, user) => {
    event.emit("part", { channel, user })
    console.log(`${user} has left ${channel}`);
  });

  chatClient.onSlow((channel, enabled, delay) => {
    event.emit("slowmode", { channel, enabled, delay });
  });

  chatClient.onUniqueChat((channel, enabled) => {
    event.emit("uniquemode", { channel, enabled });
  });
}
eventSubListener.onChannelBan(BOT_ID, (event) => {
  console.log('Ban event:', event);
});
/**
 * Description placeholder
 * @date 10:29:01 am
 *
 * @param {*} userInfo
 * @param {string} BOT_ID
 * @returns {string[]}
 */
function getRoles(userInfo: any, BOT_ID: string): string[] {
  return [
    { role: "self", condition: userInfo.userId === BOT_ID },
    { role: "founder", condition: userInfo.isFounder },
    { role: "broadcaster", condition: userInfo.isBroadcaster },
    { role: "moderator", condition: userInfo.isMod },
    { role: "vip", condition: userInfo.isVip },
    { role: "subscriber", condition: userInfo.isSubscriber },
    { role: "pleb", condition: true },
  ]
    .filter((entry) => entry.condition)
    .map((entry) => entry.role);
}

export { event }
export default registerChatClientEvents

