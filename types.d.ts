import {
  ChatMessage,
  ChatAnnouncementInfo,
  ChatSubInfo,
  ChatSubGiftInfo,
  ChatCommunitySubInfo,
  ClearChat,
  ClearMsg,
  UserNotice,
} from "@twurple/chat";
import { AuthProvider, UserIdResolvable } from "@twurple/api";

// Declare global scope to define interfaces globally
declare global {
  /**
   * Chat Data & Metadata
   */
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
    isFounder?: boolean;
    userId?: string;
    color?: string | undefined;
    userName: string;
  }

  interface Metadata {
    channelId: string | null;
    channel: string;
    isMod: boolean;
    isSubscriber: boolean;
    isVip: boolean;
    isBroadcaster: boolean;
    isFounder?: boolean;
    userId: string;
    userName: string;
    emotes: Map<string, string>;
    badges: Map<string, string>;
    color: string | undefined;
    messages: Array<{
      messageId?: string;
      messageContent?: string;
      timestamp?: Date;
    }>;
  }

  interface MessageData {
    messageContent: string;
    timestamp: Date;
    messageId: string;
  }

  /**
   * User and Channel Configuration
   */
  interface UserData {
    userId: string;
    userName: string;
    channelId: string | null;
    isMod: boolean;
    isVip: boolean;
    isBroadcaster: boolean;
    isSubscriber: boolean;
    isFounder: boolean;
    color: string | undefined;
    messages: Array<{
      messageContent?: string;
      timestamp?: string;
      msgId?: string;
    }>;
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

  interface ChannelInterface {
    channelName: string;
    id?: string;
    isLive?: boolean;
  }

  /**
   * Twitch Event Interfaces
   */
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

  /**
   * Event Handling Interfaces
   */
  interface SubscriptionEvents {
    subscription_message: string;
    resub_message: string;
    gift_subscription_message: string;
    community_sub_message: string;
    reward_gift_message: string;
    bits_badge_upgrade_message: string;
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

  interface GeneralEvents {
    message: string;
    raid_message: string;
    raid_cancel_message: string;
    whisper_message: string;
    no_permission_message: string;
    ritual_message: string;
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

  /**
   * Summoner Info (External Data)
   */
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

  /**
   * Mapping for User and Channel Data
   */
  type MapTypes = {
    USER_DATA_MAP: Map<string, UserData>;
    CHANNEL_MAP: Map<string, ChannelConfig>;
  };
}

// Custom module declarations
declare module "@bot/*";
declare module "@utils/*";
declare module "@components/*";

export {};
