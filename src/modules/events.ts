import { EventEmitter } from "events";
import {
  ChatAnnouncementInfo,
  ChatMessage,
  ClearChat,
  ClearMsg,
  UserNotice,
  ChatClient,
  ChatSubInfo,
  ChatSubGiftInfo,
  ChatCommunitySubInfo,
} from "@twurple/chat";

import { logChannelMessage } from "./logger.js";
import { channelsMap } from "../utils/async config.js";
import { getDynamicDate } from "../formatting/constants.js";
import { colors } from "../formatting/chalk.js";
import { getEventMessages } from "../formatting/loadJSON.js";
import { chatClient } from "../bot.js";

const event = new EventEmitter();

// Handles the 'ban' event
// Handles the 'message' event
registerEvent("message", async ({ channel, user, text, msg }: MessageEvent) => {
  await logChannelMessage(channel, user, text, msg);
});

// Handles the 'ban' event
registerEvent("ban", async ({ channel, user, msg }: BanEvent) => {
  // console.log(`${user} is banned from ${channel}`);
  console.log(
    await getEventMessages("moderatorEvent", "ban_message", {
      channel: channel,
      user: user,
    }),
  );
});

// Handles the 'timeout' event
registerEvent("timeout", async ({ channel, user, duration, msg }: TimeoutEvent) => {
  console.log(`${user} was timed out for ${duration} seconds in ${channel}`);
});

// Handles the 'messageRemove' event
registerEvent(
  "messageRemove",
  async ({ channel, messageId, msg }: MessageRemoveEvent) => {
    console.log(`Message with ID ${messageId} was removed in ${channel}`);
  }
);

// Handles the 'announcement' event
registerEvent(
  "announcement",
  async ({ channel, user, announcementInfo, msg }: AnnouncementEvent) => {
    console.log(`Announcement from ${user} in ${channel}: ${announcementInfo}`);
  }
);

// Handles the 'newSub' event
registerEvent("newSub", async ({ channel, user, subInfo }: SubEvent) => {
  console.log(`${user} subscribed to ${channel} for ${subInfo} months.`);
});

registerEvent("slowmode", async ({}) => {

})

registerEvent("uniquemode", async ({}) => {

})

registerEvent("onBitsBadgeUpgrade", async ({channel, user, upgradeInfo, msg}) => {

})

registerEvent("clear", async ({channel, msg}) => {

})

registerEvent("noPermission", async ({channel, text}) => {

})

registerEvent("raid", async ({channel, user, raidInfo, msg})=> {

})

registerEvent("raidCancel", async ({channel, msg})=> {

})

registerEvent("rewardGift", async ({channel, user, rewardGiftInfo, msg}) => {

})

registerEvent("ritual", async ({channel, user, ritualInfo, msg}) => {

})

registerEvent("whisper", async ({user, text, msg}) => {
  
})

registerEvent("onTokenFailure", async ({err}) => {
console.error(err);
})
async function registerChatClientEvents(chatClient: ChatClient) {
  chatClient.onMessage(
    (channel: string, user: string, text: string, msg: ChatMessage) => {
      event.emit("message", { channel, user, text, msg });
    }
  );

  chatClient.onBan((channel: string, user: string, msg: ClearChat) => {
    event.emit("ban", { channel, user, msg });
  });

  chatClient.onMessageRemove(
    (channel: string, messageId: string, msg: ClearMsg) => {
      event.emit("messageRemove", { channel, messageId, msg });
    }
  );

  chatClient.onTimeout(
    (channel: string, user: string, duration: number, msg: ClearChat) => {
      event.emit("timeout", { channel, user, duration, msg });
    }
  );

  chatClient.onAnnouncement(
    (
      channel: string,
      user: string,
      announcementInfo: ChatAnnouncementInfo,
      msg: UserNotice
    ) => {
      event.emit("announcement", { channel, user, announcementInfo, msg });
    }
  );

  chatClient.onAction(
    (channel: string, user: string, text: string, msg: ChatMessage) => {
      event.emit("action", { channel, user, text, msg });
    }
  );

  await connectionEvents(chatClient);
  // Add subscription event handling
  let condition = channelsMap.get("iwdominate")?.shouldThankSubscription;
  if (condition) {
    await subEvents(chatClient);
  }
  await channelEvents(chatClient);
}

async function connectionEvents(chatClient: ChatClient): Promise<void> {
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

async function channelEvents(chatClient: ChatClient): Promise<void> {
  chatClient.onChatClear((channel: string, msg: ClearChat) => {
    console.log(`Chat cleared in ${channel}`);
  });

  chatClient.onSubsOnly((channel: string, enabled: boolean) => {
    console.log(
      `Subs-only mode ${enabled ? "enabled" : "disabled"} in ${channel}`
    );
  });

  chatClient.onEmoteOnly((channel: string, enabled: boolean) => {
    console.log(
      `Emote-only mode ${enabled ? "enabled" : "disabled"} in ${channel}`
    );
  });

  chatClient.onFollowersOnly(
    (channel: string, enabled: boolean, delay?: number | undefined) => {
      console.log(
        `Followers-only mode ${
          enabled ? `enabled with ${delay} min` : "disabled"
        } in ${channel}`
      );
    }
  );

  chatClient.onPart((channel: string, user: string) => {
    console.log(`${user} has left the ${channel} chat`);
  });

  chatClient.onSlow(
    (channel: string, enabled: boolean, delay?: number | undefined) => {
      console.log(
        `Slow mode ${
          enabled ? `enabled with ${delay} seconds delay` : "disabled"
        } in ${channel}`
      );
    }
  );

  chatClient.onUniqueChat((channel: string, enabled: boolean) => {
    console.log(
      `Unique chat ${enabled ? "enabled" : "disabled"} in ${channel}`
    );
  });
}

// Subscription event handling
async function subEvents(chatClient: ChatClient): Promise<void> {
  // Handle new subscriptions
  const handleNewSubscription = (
    channel: string,
    user: string,
    subInfo: ChatSubInfo,
    msg: UserNotice
  ): void => {
    try {
      const channelConfig = channelsMap.get(channel);
      if (channelConfig?.shouldThankSubscription) {
        chatClient.say(
          channel,
          `${user} has just subscribed for ${subInfo.months} months!`
        );
        event.emit("newSub", { channel, user, subInfo });
      }
    } catch (error) {
      console.error("Error handling new subscription event:", error);
    }
  };

  // Handle resubscriptions
  const handleResubscription = (
    channel: string,
    user: string,
    subInfo: ChatSubInfo,
    msg: UserNotice
  ): void => {
    try {
      const channelConfig = channelsMap.get(channel);
      if (channelConfig?.shouldThankSubscription) {
        chatClient.say(
          channel,
          `Thanks @${user} for resubscribing for ${subInfo.months} months!`
        );
        event.emit("resub", { channel, user, subInfo });
      }
    } catch (error) {
      console.error("Error handling resubscription event:", error);
    }
  };

  // Handle gifted subscriptions
  const handleSubGift = (
    channel: string,
    user: string,
    subInfo: ChatSubGiftInfo,
    msg: UserNotice
  ): void => {
    try {
      const gifter = subInfo.gifter;
      chatClient.say(
        channel,
        `Thanks @${gifter} for gifting a sub to ${subInfo.displayName}!`
      );
      event.emit("subgift", { channel, gifter, subInfo });
    } catch (error) {
      console.error("Error handling gifted subscription event:", error);
    }
  };

  // Handle community gifted subscriptions
  const handleCommunitySub = (
    channel: string,
    user: string,
    subInfo: ChatCommunitySubInfo,
    msg: UserNotice
  ): void => {
    try {
      chatClient.say(
        channel,
        `${user} has gifted ${subInfo.count} subs to the community!`
      );
      event.emit("communitySub", { channel, user, subInfo });
    } catch (error) {
      console.error("Error handling community subscription event:", error);
    }
  };

  // Set up event handlers for different subscription types
  chatClient.onSub(handleNewSubscription);
  chatClient.onResub(handleResubscription);
  chatClient.onSubGift(handleSubGift);
  chatClient.onCommunitySub(handleCommunitySub);
}

async function say(channel: string, callback: () => Promise<string>): Promise<void> {
  const message = await callback();
  chatClient.say(channel, message);
}
async function registerEvent(eventType: string, handler: (params: any) => void): Promise<void> {
  event.on(eventType, async (params) => {
    try {
      handler(params);
    } catch (error) {
      console.error(`Error handling ${eventType} event:`, error);
    }
  })
}
export default registerChatClientEvents;
