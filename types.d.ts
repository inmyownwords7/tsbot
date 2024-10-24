import { ChalkInstance } from "chalk";
import {
  ChatMessage,
  ChatAnnouncementInfo,
  ChatSubInfo,
  ChatSubGiftInfo,
  ChatCommunitySubInfo,
} from "@twurple/chat";
import { ClearChat, ClearMsg, UserNotice } from "@twurple/chat";
import { UserIdResolvable, AuthProvider } from "@twurple/api";

declare global {
  // Log color and badge type enums
  type LogColor = "red" | "blue" | "green" | "yellow" | "magenta" | "cyan";
  type BadgeType = "moderator" | "deputy" | "vip" | "pleb" | "subscriber";
  // Subscription Types
  type SubscriptionType =
    | "new"
    | "extend"
    | "resub"
    | "community"
    | "communityPayForward"
    | "subgift";

  // Color keys for different roles or events
  type ColorKeys =
    | "tfblade"
    | "iwdominate"
    | "akanemko"
    | "perkz_lol"
    | "magenta"
    | "cyan"
    | "white"
    | "gray"
    | "defaultColor";

  // MetaData Interface for chat message details
  interface MessageMetaData {
    channelId?: string;
    isMod?: boolean;
    isVip?: boolean;
    isBroadcaster?: boolean;
    isParty?: boolean;
    isStaff?: boolean;
    isDeputy?: boolean;
    isEntitled?: boolean;
    isPermitted?: boolean;
    isSubscriber?: boolean;
    userId?: string;
    userName: string;
  }

  // Remove ChatClient Interface to avoid conflict with Twurple's ChatClient

  // Event Interfaces for Twitch events
  interface MessageEvent {
    channel: string;
    user: string;
    text: string;
    msg: ChatMessage;
  }

  interface BanEvent {
    channel: string;
    user: string;
    msg: ClearChat;
  }

  interface TimeoutEvent {
    channel: string;
    user: string;
    duration: number;
    msg: ClearChat;
  }

  interface MessageRemoveEvent {
    channel: string;
    messageId: string;
    msg: ClearMsg;
  }

  interface AnnouncementEvent {
    channel: string;
    user: string;
    announcementInfo: ChatAnnouncementInfo;
    msg: UserNotice;
  }

  interface SubscriptionCategory {
    channel: string;
    user: string;
    subInfo: ChatSubInfo | ChatSubGiftInfo | ChatCommunitySubInfo;
  }

  // User Data Interface for user information in events
  interface UserData {
    userId: string;
    isMod: boolean;
    isVip: boolean;
    isBroadcaster: boolean;
    isSubscriber: boolean;
    userName: string;
    isStaff?: boolean;
    isParty?: boolean;
    isDeputy?: boolean;
    isFounder?: boolean;
    channelId?: string | UserIdResolvable | null;
    color?: string;
  }

  // ChatConfig Interface for chat configuration
  interface ChatConfig {
    authProvider: AuthProvider;
    channels: string[];
    webSocket: boolean;
  }

  // Summoner Info and Ranked Info for external data
  interface SummonerInfo {
    id: string;
    accountId: string;
    puuid: string;
    name: string;
    profileIconId: number;
    summonerLevel: number;
  }

  interface RankedInfo {
    leagueId: string;
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }

  // ChannelConfig Interface for channel settings
  interface ChannelConfig {
    isForeignEnabled: boolean;
    shouldThankSubscription: boolean;
    toggleLog: boolean;
    logColor: string;
    isFlamingEnabled: boolean;
    toggleTempo: boolean;
    banCount: number;
    messageDeletedCounter: number;
    timeCounter: number;
    subCounter: number;
    accountUserAge: boolean;
    isKoreanEnabled: boolean;
  }

  // Metadata Interface for detailed message metadata
  interface Metadata {
    channel: string;
    isMod: boolean;
    isSubscriber: boolean;
    isVip: boolean;
    isBroadcaster: boolean;
    userId: string;
    userName: string;
    messageId: string;
    messageContent: string;
    timestamp: Date;
    emotes: Map<string, string>;
    badges: Map<string, string>;
    color: string | undefined;
  }

  interface SubscriptionEvents {
    subscription_message: string;
    resub_message: string;
    gift_subscription_message: string;
    community_sub_message: string;
    reward_gift_message: string;
    bits_badge_upgrade_message: string
  }

  interface ModeratorEvents {
    ban_message: string;
    timeout_message: string;
    announcement_message: string;
    remove_message: string;
    subs_only_mode_message: string;
    chat_clear_message: string;
    slow_mode_message: string;
    emote_only_mode_message: string;
    unique_mode_message: string;
    on_token_success_message: string;
    on_token_failure_message: string;
  }

  interface ConnectionEvents {
    connect_message: string;
    disconnect_message: string;
    join_message: string;
    part_message: string;
  }

  interface ChannelEvents {
    moderatorEvents: ModeratorEvents;
    generalEvents: GeneralEvents;
    connectionEvents: ConnectionEvents;
    subscriptionEvents: SubscriptionEvents;
     // Optional, as some channels might not have connection events
  }

  interface GeneralEvents {
    message: string;
    raid_message: string;
    raid_Cancel_message: string;
    whisper_message: string;
    no_permission_message: string;
    ritual_message: string;
  }

  interface EventMessages {
    [channel: string]: ChannelEvents; // Dynamic key for each channel (e.g., "tfblade", "iwdominate")
  }
}

// Module declarations for custom imports
declare module "@bot/*";
declare module "@utils/*";
declare module "@components/*";

export {};
