import { EventEmitter } from "events";
import {
  ChatClient
} from "@twurple/chat";
import { logChannelMessage } from "./logger.js";
import { channelsMap } from "../utils/async config.js";
import { botId } from "../formatting/constants.js";
import { chatClient } from "../bot.js";
import { eventSubListener } from "./auth.js";

/**
 * Description placeholder
 * @date 1:37:46 pm
 *
 * @type {UserData}
 */
let commandMessageData: UserData = {
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
const metadataParts: string[] = [];

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
    let { color, userId, isBroadcaster, isMod, isVip, isSubscriber, isFounder } = msg.userInfo;
    let { channelId } = msg
    const roles = [
      { role: "self", condition: userId === botId },
      { role: "founder", condition: isFounder },
      { role: "broadcaster", condition: isBroadcaster },
      { role: "moderator", condition: isMod },
      { role: "vip", condition: isVip },
      { role: "subscriber", condition: isSubscriber },
      { role: "pleb", condition: true },
    ];
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
    }
    metadataParts.length = 0;
    for (const { role, condition } of roles) {
      if (condition) {
        metadataParts.push(role);
        break;
      }
    }
    // console.log(msg.userInfo.badgeInfo)
    // console.log(msg.userInfo.badges)
    // console.log("This is the message: " + msg)
    // executeCommand(channel, user, text, msg, commandMessageData)
    const roleString = metadataParts.join(", ");
    await logChannelMessage(channel, user, text, msg);
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

  event.on("onBitsBadgeUpgrade", async ({ channel, user, upgradeInfo, msg }) => {
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
    console.log(`${user} has joined ${channel}`);
  });
}

async function eventSubscriptionHandlers(event: EventEmitter): Promise<void> {
  const giftCounts: Map<string, number> = new Map();
  event.on("onSub", async ({ channel, user, subInfo }: SubEvent) => {
    const months: number = subInfo?.months ?? 0;
    const isPrime: boolean = subInfo?.isPrime ?? false;
    const streak: number | undefined = subInfo?.streak; // streak remains number | undefined
    // Message Templates
    const messages = {
      prime: (user: string, months: number) =>
        `Thank you @${user} for subscribing with a Prime sub to the elderly iwdOld ${channel} for ${months} month${months > 1 ? "s" : ""}!`,
      streakPrime: (user: string, streak: number, months: number) =>
        `Thank you @${user} for subscribing with a streak Prime sub for ${streak} month${streak > 1 ? "s" : ""} to the elderly iwdOld ${channel}! (Total: ${months} month${months > 1 ? "s" : ""})`,
      normal: (user: string, months: number) =>
        `Thank you @${user} for subscribing to the elderly iwdOld ${channel} for ${months} month${months > 1 ? "s" : ""}!`,
      streakNormal: (user: string, streak: number, months: number) =>
        `Thank you @${user} for subscribing with a streak of ${streak} month${streak > 1 ? "s" : ""} to the elderly iwdOld ${channel}! (Total: ${months} month${months > 1 ? "s" : ""})`,
      zeroMonthsPrime: (user: string) =>
        `Thank you @${user} for subscribing with a Prime sub to the elderly iwdOld ${channel}! Your support means a lot!`,
      zeroMonthsNormal: (user: string) =>
        `Thank you @${user} for subscribing to the elderly iwdOld ${channel}! Your support means a lot!`,
    };

    // Determine Message and Logging
    if (months === 0) {
      if (isPrime) {
        // Prime subscription with 0 months
        console.log(`[Subscription] ${user} subscribed with a Prime sub in ${channel} (0 months, possibly new).`);
        chatClient.say(channel, messages.zeroMonthsPrime(user));
      } else {
        // Normal subscription with 0 months
        console.log(`[Subscription] ${user} subscribed in ${channel} (0 months, possibly new).`);
        chatClient.say(channel, messages.zeroMonthsNormal(user));
      }
    } else if (isPrime && streak) {
      // Prime subscription with streak
      console.log(`[Subscription] ${user} has a Prime streak sub in ${channel} for ${streak} month(s) (Total: ${months} month(s)).`);
      chatClient.say(channel, messages.streakPrime(user, streak, months));
    } else if (isPrime) {
      // Prime subscription without streak
      console.log(`[Subscription] ${user} subscribed with Prime in ${channel} for ${months} month(s).`);
      chatClient.say(channel, messages.prime(user, months));
    } else if (streak) {
      // Normal subscription with streak
      console.log(`[Subscription] ${user} subscribed normally in ${channel} with a streak of ${streak} month(s) (Total: ${months} month(s)).`);
      chatClient.say(channel, messages.streakNormal(user, streak, months));
    } else {
      // Normal subscription without streak
      console.log(`[Subscription] ${user} subscribed normally in ${channel} for ${months} month(s).`);
      chatClient.say(channel, messages.normal(user, months));
    }
  });

  event.on("onSubGift", async ({ channel, user, subGiftInfo, msg }: SubGiftEvent) => {
    const gifter = user || "Anonymous";
    const recipient = subGiftInfo?.displayName || "unknown recipient";
    const previousGiftCount = giftCounts.get(gifter) ?? 0;

    if (previousGiftCount > 0) {
      // Update gift count
      giftCounts.set(gifter, previousGiftCount - 1);
    }
    console.log(`[SubGift] ${gifter} gifted a subscription to ${recipient} in ${channel}.`);
    chatClient.say(
      channel,
      `Thanks ${gifter} for gifting a sub to ${recipient} and supporting the elderly iwdOld!`
    );
  });

  event.on("onCommunitySub", async ({ channel, gifterName, giftInfo, msg }: CommunitySubEvent) => {
    const previousGiftCount = giftCounts.get(gifterName) ?? 0;
    giftCounts.set(gifterName, previousGiftCount + giftInfo.count);
    chatClient.say(channel, `Thank you @${gifterName} for gifting ${giftInfo.count} subs to support the elderly iwdOld!`);
  });

  event.on("onResub", async ({ channel, user, subInfo, msg }: ResubEvent) => {
    const months: number = subInfo?.months ?? 0;
    const isPrime: boolean = subInfo?.isPrime ?? false;
    const streak: number | undefined = subInfo?.streak; // streak remains number | undefined
    // Message Templates
    const messages = {
      prime: (user: string, months: number) =>
        `Thank you @${user} for subscribing with a Prime sub to the elderly iwdOld ${channel} for ${months} month${months > 1 ? "s" : ""}!`,
      streakPrime: (user: string, streak: number, months: number) =>
        `Thank you @${user} for subscribing with a streak Prime sub for ${streak} month${streak > 1 ? "s" : ""} to the elderly iwdOld ${channel}! (Total: ${months} month${months > 1 ? "s" : ""})`,
      normal: (user: string, months: number) =>
        `Thank you @${user} for subscribing to the elderly iwdOld ${channel} for ${months} month${months > 1 ? "s" : ""}!`,
      streakNormal: (user: string, streak: number, months: number) =>
        `Thank you @${user} for subscribing with a streak of ${streak} month${streak > 1 ? "s" : ""} to the elderly iwdOld ${channel}! (Total: ${months} month${months > 1 ? "s" : ""})`,
      zeroMonthsPrime: (user: string) =>
        `Thank you @${user} for subscribing with a Prime sub to the elderly iwdOld ${channel}! Your support means a lot!`,
      zeroMonthsNormal: (user: string) =>
        `Thank you @${user} for subscribing to the elderly iwdOld ${channel}! Your support means a lot!`,
    };

    // Determine Message and Logging
    if (months === 0) {
      if (isPrime) {
        // Prime subscription with 0 months
        console.log(`[Subscription] ${user} subscribed with a Prime sub in ${channel} (0 months, possibly new).`);
        chatClient.say(channel, messages.zeroMonthsPrime(user));
      } else {
        // Normal subscription with 0 months
        console.log(`[Subscription] ${user} subscribed in ${channel} (0 months, possibly new).`);
        chatClient.say(channel, messages.zeroMonthsNormal(user));
      }
    } else if (isPrime && streak) {
      // Prime subscription with streak
      console.log(`[Subscription] ${user} has a Prime streak sub in ${channel} for ${streak} month(s) (Total: ${months} month(s)).`);
      chatClient.say(channel, messages.streakPrime(user, streak, months));
    } else if (isPrime) {
      // Prime subscription without streak
      console.log(`[Subscription] ${user} subscribed with Prime in ${channel} for ${months} month(s).`);
      chatClient.say(channel, messages.prime(user, months));
    } else if (streak) {
      // Normal subscription with streak
      console.log(`[Subscription] ${user} subscribed normally in ${channel} with a streak of ${streak} month(s) (Total: ${months} month(s)).`);
      chatClient.say(channel, messages.streakNormal(user, streak, months));
    } else {
      // Normal subscription without streak
      console.log(`[Subscription] ${user} subscribed normally in ${channel} for ${months} month(s).`);
      chatClient.say(channel, messages.normal(user, months));
    }
    if (streak) {
      console.log(`[Resub] ${user} resubscribed in ${channel} for ${months} months with a streak of ${streak} months.`);
      chatClient.say(
        channel,
        `Thank you @${user} for resubscribing for ${months} months with a streak of ${streak} months!`
      );
    } else {
      console.log(`[Resub] ${user} resubscribed in ${channel} for ${months} months.`);
      chatClient.say(channel, `Thank you @${user} for resubscribing for ${months} months!`);
    }
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
      console.log(`${user} subscribed in ${channel}: for ${subInfo.months} month`)
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
eventSubListener.onChannelBan(botId, (event) => {
  console.log('Ban event:', event);
});
function getRoles(userInfo: any, botId: string): string[] {
  return [
    { role: "self", condition: userInfo.userId === botId },
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

