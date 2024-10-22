// types.d.ts
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
    // emotes and badges can be Maps if required
    // emotes: Map<string, string>;
    // badges: Map<string, string>;
  }

  // ChatClient Interface
  interface ChatClient {
    channel: string;
    user: string;
    text: string;
    msg: ChatMessage;
  }

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

  interface SubEvent {
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
    color: string;
  }

  // Log color and badge type enums
  type LogColor = "red" | "blue" | "green" | "yellow" | "magenta" | "cyan";
  type BadgeType = "moderator" | "deputy" | "vip" | "pleb" | "subscriber";

  interface ModeratorEvent {
    ban_message: string;
    message_remove: string;
    timeout_message: string;
    announcement_message: string;
    action_message: string;
  }

  interface ConnectionEvents {
    connect: string;
  }

  interface ChannelEvents {
    moderatorEvent: ModeratorEvent;
    generalEvents: GeneralEvents;
    connectionEvents?: ConnectionEvents; // Optional, as some channels might not have connection events
  }

  interface GeneralEvents {
    message: string;
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
