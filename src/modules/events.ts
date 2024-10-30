import { EventEmitter } from "events";
import {
  ChatClient
} from "@twurple/chat";

import { logChannelMessage } from "./logger.js";
import { channelsMap } from "../utils/async config.js";
import { botId } from "../formatting/constants.js";

const event = new EventEmitter();
const metadataParts: string[] = [];

// Event handlers without getEventMessages
async function eventHandlers(event: EventEmitter): Promise<void> {
  event.on("message", async ({ channel, user, text, msg }: MessageEvent) => {
    let { userId, isBroadcaster, isMod, isVip, isSubscriber } = msg.userInfo;
    const roles = [
      { role: "self", condition: userId === botId },
      { role: "broadcaster", condition: isBroadcaster },
      { role: "moderator", condition: isMod },
      { role: "vip", condition: isVip },
      { role: "subscriber", condition: isSubscriber },
      { role: "pleb", condition: true },
    ];

    metadataParts.length = 0;
    for (const { role, condition } of roles) {
      if (condition) {
        metadataParts.push(role);
        break;
      }
    }
    const roleString = metadataParts.join(", ");
    console.log(`[${channel}] ${roleString} ${user}: ${text}`);
    await logChannelMessage(channel, user, text, msg);
  });

  event.on("ban", async ({ channel, user, msg }: BanEvent) => {
    console.log(`User ${user} is banned from ${channel}`);
  });

  event.on("timeout", async ({ channel, user, duration, msg }: TimeoutEvent) => {
    console.log(`User ${user} has been timed out in ${channel} for ${duration} seconds`);
  });

  event.on("messageRemove", async ({ channel, messageId, msg }: MessageRemoveEvent) => {
    console.log(`Message with ID ${messageId} removed from ${channel}`);
  });

  event.on("announcement", async ({ channel, user, announcementInfo, msg }: AnnouncementEvent) => {
    console.log(`Announcement from ${user} in ${channel}: ${announcementInfo}`);
  });

  event.on("newSub", async ({ channel, user, subInfo }: SubscriptionCategory) => {
    console.log(`${user} has subscribed to ${channel} for ${subInfo} months.`);
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

  event.on("onSub", async ({ channel, user, subInfo, msg }) => {
    console.log(`${user} subscribed in ${channel}: ${subInfo}`);
  });

  event.on("onSubGift", async ({ channel, user, subGiftInfo, msg }) => {
    console.log(`${user} gifted a subscription in ${channel}`);
  });

  event.on("onCommunitySub", async ({ channel, user, communitySubInfo, msg }) => {
    console.log(`Community subscription by ${user} in ${channel}`);
  });

  event.on("onCommunitySubGift", async ({ channel, user, communitySubGiftInfo, msg }) => {
    console.log(`Community subscription gift by ${user} in ${channel}`);
  });

  event.on("join", ({ channel, user }) => {
    console.log(`${user} has joined ${channel}`);
  });
}

// Register ChatClient Events
async function registerChatClientEvents(chatClient: ChatClient) {
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

  await connectionEvents(chatClient);
  if (channelsMap.get("iwdominate")?.shouldThankSubscription) {
    await subEvents(chatClient);
  }
  await channelEvents(chatClient);
  await eventHandlers(event);
}

async function connectionEvents(chatClient: ChatClient): Promise<void> {
  chatClient.onJoin((channel, user) => {
    event.emit("join", { channel, user });
  });

  chatClient.onDisconnect(() => {
    console.log("Disconnected from Twitch");
  });

  chatClient.onConnect(() => {
    console.log("Connected to Twitch");
  });

  chatClient.onPart((channel, user) => {
    console.log(`${user} has left ${channel}`);
  });
}

async function subEvents(chatClient: ChatClient): Promise<void> {
  chatClient.onSub((channel, user, subInfo, msg) => {
    event.emit("onSub", { channel, user, subInfo, msg });
  });

  chatClient.onResub((channel, user, subInfo, msg) => {
    event.emit("resub", { channel, user, subInfo, msg });
  });

  chatClient.onSubGift((channel, user, subInfo, msg) => {
    event.emit("onSubGift", { channel, user, subInfo, msg });
  });

  chatClient.onCommunitySub((channel, user, subInfo, msg) => {
    event.emit("onCommunitySub", { channel, user, subInfo, msg });
  });
}

async function channelEvents(chatClient: ChatClient): Promise<void> {
  chatClient.onChatClear((channel, msg) => {
    event.emit("clear", { channel, msg });
  });

  chatClient.onSubsOnly((channel, enabled) => {
    console.log(`Sub-only mode is ${enabled ? "enabled" : "disabled"} in ${channel}`);
  });

  chatClient.onEmoteOnly((channel, enabled) => {
    console.log(`Emote-only mode is ${enabled ? "enabled" : "disabled"} in ${channel}`);
  });

  chatClient.onFollowersOnly((channel, enabled, delay) => {
    console.log(`Followers-only mode is ${enabled ? "enabled" : "disabled"} in ${channel} with delay ${delay}`);
  });

  chatClient.onPart((channel, user) => {
    console.log(`${user} has left ${channel}`);
  });

  chatClient.onSlow((channel, enabled, delay) => {
    event.emit("slowmode", { channel, enabled, delay });
  });

  chatClient.onUniqueChat((channel, enabled) => {
    event.emit("uniquemode", { channel, enabled });
  });
}

export default registerChatClientEvents;
