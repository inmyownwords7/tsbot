// types.d.ts
import { ChalkInstance } from "chalk";
import {ChatMessage} from "@twurple/chat"
import { UserIdResolvable } from "@twurple/api";

declare global {
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
    channelId?: string;
    userId?: string;
    userName: string;
    // emotes: Map<string, string>;
    // badges: Map<string, string>
  }

interface ChatClient {
channel: string;
user: string;
text: string; 
msg: ChatMessage;
}

interface userData {
  userId: userId;
  isMod: metadata.isMod| false;
  isVip: metadata.isVip | false;
  isBroadcaster: metadata.isBroadcaster | false;
  isSubscriber: metadata.isSubscriber | false;
  userName: metadata.userName | `username_${userId}` | undefined;
  isStaff?: isMod | isBroadcaster | false;
  isParty?: isMod | isBroadcaster | false;
  isDeputy?: isMod | isBroadcaster | false;
  isFounder?: isFounder | false;
  channelId?: metadata.channelId | undefined | UserIdResolvable | null;
  color?: metadata | string | undefined;
}
  type SubscriptionType = "new" | "extend" | "resub" | "community" | "communityPayForward" | "subgift";
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

  interface ChatConfig {
    authProvider: AuthProvider;
    channels: string[];
    webSocket: boolean;
  }

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

  interface metadata {
    channel: channel,
    isMod: isMod,
    isSubscriber: isSubscriber,
    isVip: isVip,
    isBroadcaster: isBroadcaster,
    userId: userId,
    userName: displayName,
    messageId: msg.id,
    messageContent: text, // You can extract additional info like type, badges, etc.
    timestamp: msg.date,
    emotes: msg.userInfo.badgeInfo, // Array of emotes used in the message
    badges: msg.userInfo.badges,
    color: color, 
  }

  type LogColor = "red" | "blue" | "green" | "yellow" | "magenta" | "cyan";
  type badgeType = "moderator" | "deputy" | "vip" | "pleb" | "subscriber";
}

declare module "@bot/*";
declare module "@utils/*";
declare module "@components/*";

export {};
