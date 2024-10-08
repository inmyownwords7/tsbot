// types.d.ts
import { ChalkInstance } from "chalk";
declare global {
  interface MessageMetaData {
    isMod?: boolean;
    isVip?: boolean;
    isBroadcaster?: boolean;
    isParty?: boolean;
    isStaff?: boolean;
    isDeputy?: boolean;
    isEntitled?: boolean;
    isPermitted?: boolean;
    channelId?: string;
    userId?: string;
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

  type LogColor = "red" | "blue" | "green" | "yellow" | "magenta" | "cyan";
}

declare module "@bot/*";
declare module "@utils/*";
declare module "@components/*";

export {};
