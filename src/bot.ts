import { ChatClient, ChatMessage } from "@twurple/chat";
import { authProvider } from "./modules/auth.js";

const channels: string[] = ["tfblade", "iwdominate"];
export const chatClient = new ChatClient({ authProvider, channels });
let GroupArray: string[] = [];
let GroupArrayIds: string[] = [];
// await extractIdsFromUser(GroupArray);

type MessageMetaData = {
  isMod?: boolean; // Assuming this should be a boolean
  isVip?: boolean; // Assuming this should be a boolean
  isBroadcaster?: boolean; // Assuming this should be a boolean
  isParty?: boolean; // Assuming this should be a boolean
  isStaff?: boolean; // Assuming this should be a boolean
  isDeputy?: boolean; // Assuming this should be a boolean
  isEntitled?: boolean; // Assuming this should be a boolean
  isPermitted?: boolean; // Assuming this should be a boolean
  channelId?: string; // Required string
  userId?: string; // Required string
};

export function handleMessage(
  channel: string,
  user: string,
  text: string,
  msg: ChatMessage
): void {
  const messageMetaData: MessageMetaData = {
    isMod: msg.userInfo.isMod || false, // Handles falsy values other than null/undefined
    isVip: msg.userInfo.isVip || false,
    isBroadcaster: msg.userInfo.isBroadcaster || false,
    isParty:
      GroupArray.includes(user) ||
      GroupArrayIds.includes(msg.userInfo.userId || ""),
    isStaff: msg.userInfo.isMod || false || msg.userInfo.isBroadcaster || false,
    isDeputy:
      GroupArray.includes(user) ||
      GroupArrayIds.includes(msg.userInfo.userId || ""),
    isEntitled:
      msg.userInfo.isMod ||
      false ||
      msg.userInfo.isVip ||
      false ||
      msg.userInfo.isBroadcaster ||
      false,
    isPermitted:
      (msg.userInfo.isMod || false || msg.userInfo.isBroadcaster || false) &&
      GroupArray.includes(user),
    channelId: msg.channelId || "", // Handles other falsy values as well
    userId: msg.userInfo.userId || "",
  };

  const messageHandlers: Array<
    (
      channel: string,
      user: string,
      text: string,
      msg: ChatMessage,
      messageMetaData: MessageMetaData
    ) => void
  > = [];

  for (const handler of messageHandlers) {
    handler(channel, user, text, msg, messageMetaData);
  }
  // TODO: Implement logic to handle messages, update logger, and interact with Twitch API
  //I have to set the commands here to handle different message types
}

export async function bot(): Promise<void> {
  try {
    chatClient.connect(); // Wait for the connection to succeed
    console.log("Connected to Twitch chat");
  } catch (err) {
    console.error("Failed to connect to Twitch chat:", err);
  }
  chatClient.onMessage(handleMessage);
}

// function extractIdsFromUser(GroupArray: any) {
//   throw new Error("Function not implemented.");
// }
