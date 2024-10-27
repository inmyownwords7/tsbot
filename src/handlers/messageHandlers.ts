// import { userDataMap, saveChatMessageData } from "../handlers/asyncConfig.js";
// import { logChannelMessage } from "../utils/logger.js";

// // Handles the 'message' event
// export async function handleMessageEvent({
//   channel,
//   user,
//   text,
//   msg,
// }: MessageEvent): Promise<void> {
//   const { userId, displayName } = msg.userInfo;
//   const { id } = msg;

//   // Get or create user data
//   let userData = userDataMap.get(userId);
//   if (!userData) {
//     userData = {
//       userId: userId,
//       userName: displayName.toLowerCase(),
//       messages: [],
//     };
//   }

//   // Add the new message to the user's messages array
//   userData.messages.push({
//     messageContent: text,
//     timestamp: new Date().toISOString(),
//     msgId: id,
//   });

//   // Save updated user data
//   userDataMap.set(userId, userData);
//   await saveChatMessageData(userData);

//   // Log the message
//   await logChannelMessage(channel, user, text, msg);
// }
