// import { chatClient } from "../bot.js"; // Assuming chatClient is defined in bot.ts
// import { ChatMessage } from "../index.js";

// let activeUserGroups: string[] = [];
// let activeUserGroupsIds: string[] = [];

// function processChatMessage(
//   channel: string,
//   user: string,
//   text: string,
//   msg: ChatMessage
// ): void {
//   const userMessageMetadata: MessageMetaData = {
//     isMod: msg.userInfo.isMod || false,
//     isVip: msg.userInfo.isVip || false,
//     isBroadcaster: msg.userInfo.isBroadcaster || false,
//     isParty: activeUserGroups.includes(user) || activeUserGroupsIds.includes(msg.userInfo.userId || ""),
//     isStaff: msg.userInfo.isMod || msg.userInfo.isBroadcaster || false,
//     isDeputy: activeUserGroups.includes(user) || activeUserGroupsIds.includes(msg.userInfo.userId || ""),
//     isEntitled: msg.userInfo.isMod || msg.userInfo.isVip || msg.userInfo.isBroadcaster || false,
//     isPermitted: (msg.userInfo.isMod || msg.userInfo.isBroadcaster) && activeUserGroups.includes(user),
//     channelId: msg.channelId || "",
//     userId: msg.userInfo.userId || "",
//   };

//   executeCommand(channel, user, text, msg, userMessageMetadata);
// }

// function executeCommand(
//   channel: string,
//   user: string,
//   text: string,
//   msg: ChatMessage,
//   userMessageMetadata: MessageMetaData
// ): void {
//   const command = text.split(" ")[0];

//   // Check if the command starts with "!"
//   if (!command.startsWith("!")) return; 

//   const commandHandlers: Record<
//     string,
//     (channel: string, user: string, userMessageMetadata: MessageMetaData) => void
//   > = {
//     "!quit": quitChatHandler,
//     "!help": helpCommandHandler,
   
//     // Add more commands here
//   };

//   const handler = commandHandlers[command];
//   if (handler) {
//     handler(channel, user, userMessageMetadata);
//   } else {
//     console.log(`Unknown command: ${user}: ${command}`);
//   }
// }

// function quitChatHandler(
//   channel: string,
//   user: string,
//   userMessageMetadata: MessageMetaData
// ): void {
//   if (userMessageMetadata.isMod && channel === "iwdominate") {
//     chatClient.quit();
//     console.log(`${user} has quit the chat.`);
//   }
// }

// function helpCommandHandler(channel: string, user: string): void {
//   chatClient.say(channel, "Available commands: !quit, !help, !hello");
// }

// // Example command handler for a hello command
// function greetUserHandler(
//   channel: string,
//   user: string,
//   text: string,
//   msg: ChatMessage
// ): void {
//   chatClient.say(channel, `Hello, ${user}! Welcome to the channel!`);
// }

// export { processChatMessage };
