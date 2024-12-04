import {
  ChatMessage,
  ChatAnnouncementInfo,
  ChatSubInfo,
  ChatSubGiftInfo,
  ClearChat,
  ClearMsg,
  UserNotice,
  ChatCommunitySubInfo,
} from "@twurple/chat";
import { AuthProvider } from "@twurple/api";

// Declare global types and interfaces
declare global {
  // ===== Enums and Types =====

  type LogColor = "red" | "blue" | "green" | "yellow" | "magenta" | "cyan";
  type BadgeType =
    | "streamer"
    | "moderator"
    | "deputy"
    | "vip"
    | "pleb"
    | "subscriber";
  type SubscriptionType =
    | "new"
    | "extend"
    | "resub"
    | "community"
    | "communityPayForward"
    | "subgift";
  type UserGroup =
    | "isParty"
    | "isStaff"
    | "isDeputy"
    | "isEntitled"
    | "isPermitted";

  // ===== Permission and Markup =====

  interface PermissionRights {
    permissionLevel: number;
    canBan?: boolean;
    canTimeout?: boolean;
    canSendMessage?: boolean;
    canUseCommands?: boolean;
    canAccessSubOnlyContent?: boolean;
  }

  interface consoleMarkupInterface {
    log(color: LogColor, message: string): void;
    debug(color: LogColor, message: string): void;
  }

  // ===== User Data =====

  interface UserData extends MessageMetaData {
    isMod?: boolean;
    isVip?: boolean;
    isBroadcaster?: boolean;
    isSubscriber?: boolean;
    userName?: string;
    userId?: string;
    isFounder?: boolean;
    channelId?: string;
    color?: string;
  }

  interface BadgesAndEmotes extends UserData {
    badges?: Map<string, string>;
    emotes?: Map<string, string>;
  }

  interface Staff extends UserData {
    isMod?: boolean;
    isSubscriber?: boolean;
    isBroadcaster?: boolean;
    isVip?: boolean;
  }

  interface GroupMetaData extends UserData {
    isParty?: boolean;
    isStaff?: boolean;
    isDeputy?: boolean;
    isEntitled?: boolean;
    isPermitted?: boolean;
  }

  interface ExtendedGroupMetaData extends GroupMetaData {
    role?: string; // e.g., 'admin', 'moderator', 'member'
    permissions?: Array<string>; // e.g., ['read', 'write', 'execute']
    createdAt?: Date; // Creation timestamp
    updatedAt?: Date; // Last update timestamp
  }

  // ===== Twitch Events =====

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

  interface ResubEvent {
    channel: string;
    user: string;
    subInfo: ChatSubInfo;
    msg: UserNotice;
  }

  interface CommunitySubEvent {
    channel: string;
    gifterName: string;
  giftInfo: ChatCommunitySubInfo
  }

  interface SubGiftEvent {
    channel: string;
    user: string;
    subGiftInfo: ChatSubInfo;
    msg: UserNotice;
  }

  interface SubEvent {
    channel: string;
    user: string;
    subInfo: ChatSubInfo;
    msg: UserNotice;
  }

  interface SubscriptionCategory {
    channel: string;
    user: string;
    subInfo: ChatSubInfo | ChatSubGiftInfo;
  }

  // ===== Chat and Channel Configuration =====

  interface ChatConfig {
    authProvider: AuthProvider;
    channels: string[];
    webSocket: boolean;
  }

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

  // ===== Metadata and Events =====

  interface MessageMetaData {
    messages?: Array<{
      timestamp: Date;
      msgId: string;
      messageContent: string;
    }>;
  }

  interface GeneralEvents {
    message: string;
    raid_message: string;
    raid_Cancel_message: string;
    whisper_message: string;
    no_permission_message: string;
    ritual_message: string;
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

  interface SubscriptionEvents {
    subscription_message: string;
    resub_message: string;
    gift_subscription_message: string;
    community_sub_message: string;
    reward_gift_message: string;
    bits_badge_upgrade_message: string;
  }

  interface ChannelEvents {
    moderatorEvents: ModeratorEvents;
    generalEvents: GeneralEvents;
    connectionEvents: ConnectionEvents;
    subscriptionEvents: SubscriptionEvents;
  }

  interface EventMessages {
    [channel: string]: ChannelEvents; // Dynamic key for each channel (e.g., "tfblade", "iwdominate")
  }

  // ===== External Data =====

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
}

// Module declarations for custom imports
export { };
