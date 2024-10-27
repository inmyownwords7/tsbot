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
import { GETDYNAMICDATE, botId } from "../formatting/constants.js";
import { getEventMessages } from "../formatting/loadJSON.js";
import { chatClient } from "../bot.js";

const event = new EventEmitter();
const metadataParts: string[] = [];

// Handles the 'ban' event
// Handles the 'message' event
async function eventHandlers(event: EventEmitter): Promise<void> {
  event.on("message", async ({ channel, user, text, msg }: MessageEvent) => {
    let { userId, isBroadcaster, isMod, isVip, isSubscriber } = msg.userInfo;
    const roles = [
      { role: "self", condition: userId === botId },
      { role: "broadcaster", condition: isBroadcaster },
      { role: "moderator", condition: isMod },
      { role: "vip", condition: isVip },
      { role: "subscriber", condition: isSubscriber },
      { role: "pleb", condition: true }, // Default role
    ];

    metadataParts.length = 0;
    for (const { role, condition } of roles) {
      if (condition) {
        metadataParts.push(role);
        break;
      }
    }
    const roleString = metadataParts.join(", ");
    const message = await getEventMessages("generalEvents", "message", {
      channel,
      role: roleString,
      user,
      text,
    });
    console.log(message);
    await logChannelMessage(channel, user, text, msg);

    /**@commands */
    if(text === "timeout") {

    }
  });

  // Handles the 'ban' event
  event.on("ban", async ({ channel, user, msg }: BanEvent) => {
    const message = await getEventMessages("moderatorEvents", "ban_message", {
      channel,
      user,
    });
    console.log(message);
    // console.log(`${user} is banned from ${channel}`);
  });

  // Handles the 'timeout' event
  event.on(
    "timeout",
    async ({ channel, user, duration, msg }: TimeoutEvent) => {
      const message = await getEventMessages(
        "moderatorEvents",
        "timeout_message",
        {
          channel,
          user,
          duration: duration.toString(),
        }
      );
      console.log(message);
    }
  );

  // Handles the 'messageRemove' event
  event.on(
    "messageRemove",
    async ({ channel, messageId, msg }: MessageRemoveEvent) => {
      const message = await getEventMessages(
        "moderatorEvents",
        "remove_message",
        {
          channel,
          messageId,
        }
      );
      console.log(message);
    }
  );

  // Handles the 'announcement' event
  event.on(
    "announcement",
    async ({ channel, user, announcementInfo, msg }: AnnouncementEvent) => {
      const message = await getEventMessages(
        "moderatorEvents",
        "announcement_message",
        {
          channel,
          user,
          announcement: announcementInfo.toString(),
        }
      );
      console.log(message);
    }
  );

  // Handles the 'newSub' event
  event.on(
    "newSub",
    async ({ channel, user, subInfo }: SubscriptionCategory) => {
      const message = await getEventMessages(
        "subscriptionEvents",
        "subscription_message",
        {
          channel: channel,
          user: user,
          months: subInfo.toString(),
        }
      );
      console.log(message);
    }
  );

  event.on("slowmode", async ({ channel, enabled, delay }) => {
    const message = await getEventMessages(
      "moderatorEvents",
      "slow_mode_message",
      {
        channel: channel,
        enabled: enabled,
        delay: delay.toString(),
      }
    );
    console.log(message);
  });

  event.on("uniquemode", async ({ channel, enabled }) => {
    const message = await getEventMessages(
      "moderatorEvents",
      "unique_mode_message",
      {
        channel,
        enabled,
      }
    );
    console.log(message);
  });

  event.on(
    "onBitsBadgeUpgrade",
    async ({ channel, user, upgradeInfo, msg }) => {
      const message = await getEventMessages(
        "subscriptionEvents",
        "bits_badge_upgrade_message",
        {
          channel: channel,
          user: user,
          upgrade: upgradeInfo.toString(),
          msg: msg,
        }
      );
      console.log(message);
    }
  );

  event.on("clear", async ({ channel, msg }) => {
    const message = await getEventMessages(
      "moderatorEvents",
      "chat_clear_message",
      {
        channel: channel,
        msg: msg,
      }
    );
    console.log(message);
  });

  event.on("noPermission", async ({ channel, text }) => {
    const message = await getEventMessages(
      "generalEvents",
      "no_permission_message",
      {
        channel: channel,
        text: text,
      }
    );
    console.log(message);
  });

  event.on("raid", async ({ channel, user, raidInfo, msg }) => {
    const message = await getEventMessages(
      "subscriptionEvents",
      "raid_message",
      {
        channel: channel,
        user: user,
        raid: raidInfo.toString(),
        msg: msg,
      }
    );
    console.log(message);
  });

  event.on("raidCancel", async ({ channel, msg }) => {
    const message = await getEventMessages(
      "generalEvents",
      "raid_Cancel_message",
      {
        channel: channel,
        msg: msg,
      }
    );
    console.log(message);
  });

  event.on("rewardGift", async ({ channel, user, rewardGiftInfo, msg }) => {
    const message = await getEventMessages(
      "subscriptionEvents",
      "reward_gift_message",
      {
        channel: channel,
        user: user,
        rewardGift: rewardGiftInfo.toString(),
        msg: msg,
      }
    );
    console.log(message);
  });

  event.on("ritual", async ({ channel, user, ritualInfo, msg }) => {
    const message = await getEventMessages("generalEvents", "ritual_message", {
      channel: channel,
      user: user,
      ritual: ritualInfo.toString(),
      msg: msg,
    });
    console.log(message);
  });

  event.on("whisper", async ({ user, text, msg }) => {
    const message = await getEventMessages("generalEvents", "whisper_message", {
      user: user,
      text: text,
      msg: msg,
    });
    console.log(message);
  });

  event.on("onTokenFailure", async ({ err }) => {
    const message = await getEventMessages(
      "moderatorEvents",
      "on_token_failure_message",
      {
        err: err.toString(),
      }
    );
    console.error(err);
  });

  event.on("onTokenSuccess", async ({ token }) => {
    const message = await getEventMessages(
      "moderatorEvents",
      "on_token_success_message",
      {
        token: token.toString(),
      }
    );
    console.log(message);
  });

  event.on("onSub", async ({ channel, user, subInfo, msg }) => {
    const message = await getEventMessages(
      "subscriptionEvents",
      "subscription_message",
      {
        channel: channel,
        user: user,
        subInfo: subInfo.toString(),
        msg: msg,
      }
    );
    console.log(message);
  });

  event.on("onSubGift", async ({ channel, user, subGiftInfo, msg }) => {
    const message = await getEventMessages(
      "subscriptionEvents",
      "gift_subscription_message",
      {
        channel: channel,
        user: user,
        subGiftInfo: subGiftInfo,
        msg: msg,
      }
    );
    console.log(message);
  });

  event.on(
    "onCommunitySub",
    async ({ channel, user, communitySubInfo, msg }) => {
      const message = await getEventMessages(
        "subscriptionEvents",
        "community_sub_message",
        {
          channel: channel,
          user: user,
          communitySubInfo: communitySubInfo,
          msg: msg,
        }
      );
      console.log(message);
    }
  );

  event.on(
    "onCommunitySubGift",
    async ({ channel, user, communitySubGiftInfo, msg }) => {
      const message = await getEventMessages(
        "moderatorEvents",
        "community_sub_message",
        {
          channel: channel,
          user: user,
          communitySubGiftInfo: communitySubGiftInfo,
          msg: msg,
        }
      );
      console.log(message);
    }
  );
  event.on("join", async ({ channel, user }) => {
    const message = await getEventMessages("connectionEvents", "join_message", {
      channel: channel,
      user: user,
    });
    console.log(message);
  });
}

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
  await eventHandlers(event);
}

// async function connectionEvents(chatClient: ChatClient): Promise<void> {
//   chatClient.onJoin((channel: string, user: string): void => {
//     getEventMessages("connectionEvents", "join_message", {
//       channel,
//       user,
//     }).then((message) => console.log(message));
//   });

//   chatClient.onDisconnect(() => {
//     getEventMessages("connectionEvents", "disconnect_message", {}).then(
//       (message) => console.log(message)
//     );
//   });

//   chatClient.onConnect(() => {
//     getEventMessages("connectionEvents", "connect_message", {}).then(
//       (message) => console.log(message)
//     );
//   });

//   chatClient.onPart((channel: string, user: string) => {
//     getEventMessages("connectionEvents", "part_message", {
//       channel,
//       user,
//     }).then((message) => console.log(message));
//   });
// }

async function connectionEvents(chatClient: ChatClient): Promise<void> {
  chatClient.onJoin((channel: string, user: string): void => {
    event.emit("join", { channel, user });
  });

  chatClient.onDisconnect(() => {
    event.emit("disconnect", {});
  });

  chatClient.onConnect(() => {
    event.emit("connect", {});
  });

  chatClient.onPart((channel: string, user: string) => {
    event.emit("part", { channel, user });
  });
}

async function subEvents(chatClient: ChatClient): Promise<void> {
  chatClient.onSub(
    (channel: string, user: string, subInfo: ChatSubInfo, msg: UserNotice) => {
      event.emit("submode", { channel, user, subInfo, msg });
    }
  );

  chatClient.onResub(
    (channel: string, user: string, subInfo: ChatSubInfo, msg: UserNotice) => {
      event.emit("resub", { channel, user, subInfo, msg });
    }
  );

  chatClient.onSubGift(
    (
      channel: string,
      user: string,
      subInfo: ChatSubGiftInfo,
      msg: UserNotice
    ) => {
      event.emit("subgift", { channel, user, subInfo, msg });
    }
  );

  chatClient.onCommunitySub(
    (
      channel: string,
      user: string,
      subInfo: ChatCommunitySubInfo,
      msg: UserNotice
    ) => {
      event.emit("communitygift", { channel, user, subInfo, msg });
    }
  );
}

async function channelEvents(chatClient: ChatClient): Promise<void> {
  chatClient.onChatClear((channel: string, msg: ClearChat) => {
    event.emit("clear", { channel, msg });
  });

  chatClient.onSubsOnly((channel: string, enabled: boolean) => {
    event.emit("onsubmode", { channel, enabled });
  });

  chatClient.onEmoteOnly((channel: string, enabled: boolean) => {
    event.emit("emotemode", { channel, enabled });
  });

  chatClient.onFollowersOnly(
    (channel: string, enabled: boolean, delay?: number | undefined) => {
      event.emit("followmode", { channel, enabled, delay });
    }
  );

  chatClient.onPart((channel: string, user: string) => {
    event.emit("part", { channel, user });
  });

  chatClient.onSlow(
    (channel: string, enabled: boolean, delay?: number | undefined) => {
      event.emit("slowmode", { channel, enabled, delay });
    }
  );

  chatClient.onUniqueChat((channel: string, enabled: boolean) => {
    event.emit("uniquemode", { channel, enabled });
  });
}

async function say(
  channel: string,
  callback: () => Promise<string>
): Promise<void> {
  const message = await callback();
  chatClient.say(channel, message);
}

export default registerChatClientEvents;
