// types.d.ts

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
  };
  type SubscriptionType = "new" | "extend" | "resub" | "community";
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
}

export {};
