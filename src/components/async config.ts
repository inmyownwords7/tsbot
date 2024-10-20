// import fs from "fs/promises"; // Using the Promise-based version of the fs module

// let channelsMap = new Map();
// let chatMessageMap = new Map();

// const CHANNEL_DATA = "./channelsData.json";
// const CHATUSER = "./chatuser.json";

// // JSON replacer for serialization
// function jsonReplacer(key: string, value: any) {
//   if (value instanceof Map) {
//     return {
//       dataType: "Map",
//       value: Array.from(value.entries()), // Convert Map back into an array
//     };
//   }
//   return value;
// }

// // JSON reviver for deserialization
// function jsonReviver(key: string, value: any) {
//   if (value && value.dataType === "Map") {
//     return new Map(value.value); // Convert array back into a Map
//   }
//   return value;
// }

// export async function setupConfig(): Promise<void> {
//   try {
//     const channelFileExists = await fs
//       .access(CHANNEL_DATA)
//       .then(() => true)
//       .catch(() => false);

//     if (!channelFileExists) {
//       console.log(`${CHANNEL_DATA} not found. Creating new file...`);

//       let channels = [
//         { channelName: "tfblade" },
//         { channelName: "iwdominate" },
//         { channelName: "perkz_lol" },
//         { channelName: "akanemsko" },
//       ];

//       channels.forEach((channelEntry) => {
//         const universalLanguage: { [key: string]: boolean } = {
//           tfblade: false,
//           iwdominate: false,
//           perkz_lol: false,
//           akanemsko: false,
//         };

//         const channelColors: { [key: string]: string } = {
//           tfblade: "green",
//           iwdominate: "blue",
//           perkz_lol: "yellow",
//           akanemsko: "red",
//         };

//         const account: { [key: string]: boolean } = {
//           akanemsko: false,
//           tfblade: false,
//           iwdominate: true,
//         };

//         const subscription: { [key: string]: boolean } = {
//           akanemsko: false,
//           tfblade: false,
//           iwdominate: true,
//           perkz_lol: false,
//         };

//         channelsMap.set(channelEntry.channelName, {
//           isForeignEnabled: universalLanguage[channelEntry.channelName] || false,
//           shouldThankSubscription: subscription[channelEntry.channelName] || false,
//           toggleLog: true,
//           logColor: channelColors[channelEntry.channelName] || "defaultColor",
//           isFlamingEnabled: false,
//           toggleTempo: false,
//           banCount: 1,
//           messageDeletedCounter: 1,
//           timeCounter: 1,
//           subCounter: 1,
//           accountUserAge: account[channelEntry.channelName] || false,
//           isKoreanEnabled: account[channelEntry.channelName] || false,
//         });
//       });

//       const formattedData = { channelsMap };
//       await fs.writeFile(CHANNEL_DATA, JSON.stringify(formattedData, jsonReplacer, 4), {
//         encoding: "utf-8",
//       });
//       console.log(`${CHANNEL_DATA} created successfully.`);
//     } else {
//       console.log(`Loading configuration from ${CHANNEL_DATA}...`);

//       const rawdata = await fs.readFile(CHANNEL_DATA, "utf-8");
//       const parsedData = JSON.parse(rawdata, jsonReviver);

//       if (parsedData && parsedData.channelsMap) {
//         channelsMap = parsedData.channelsMap;
//         // console.log("Configuration loaded successfully.");
//       } else {
//         throw new Error("Invalid data format in the JSON file.");
//       }
//     }
//   } catch (error) {
//     console.error(`Error during setup: ${error}`);
//   }
// }

// export async function loadChatUserData(): Promise<void> {
//   try {
//     const chatUserFileExists = await fs
//       .access(CHATUSER)
//       .then(() => true)
//       .catch(() => false);

//     if (!chatUserFileExists) {
//       console.log(`${CHATUSER} not found. Creating new file...`);

//       const chatUserData = { chatMessageMap };

//       await fs.writeFile(
//         CHATUSER,
//         JSON.stringify(chatUserData, jsonReplacer, 4),
//         { encoding: "utf-8" }
//       );
//       console.log(`${CHATUSER} created successfully.`);
//     } else {
//       console.log(`Loading chat users from ${CHATUSER}...`);

//       const rawChatUserData = await fs.readFile(CHATUSER, "utf-8");
//       const parsedChatUserData = JSON.parse(rawChatUserData, jsonReviver);

//       if (parsedChatUserData && parsedChatUserData.chatMessageMap) {
//         chatMessageMap = parsedChatUserData.chatMessageMap;
//         console.log("Chat user data loaded successfully.");
//       } else {
//         throw new Error("Invalid data format in the chat user JSON file.");
//       }
//     }
//   } catch (error) {
//     console.error(`Error during setup: ${error}`);
//   }
// }

// export async function saveChatMessageData(metadata: any): Promise<void> {
//   try {
//     const userId = metadata.userId;
//     if (!chatMessageMap.has(userId)) {
//       chatMessageMap.set(userId, {
//         messages: 0,
//         isMod: metadata.isMod,
//         isVip: metadata.isVip,
//         isBroadcaster: metadata.isBroadcaster,
//         isSubscriber: metadata.isSubscriber,
//         userName: metadata.userName,
//         messageHistory: [],
//       });
//     }

//     const userData = chatMessageMap.get(userId);
//     if (userData) {
//       userData.messages += 1;
//       userData.messageHistory.push(metadata);
//     }

//     await fs.writeFile(
//       CHATUSER,
//       JSON.stringify({ chatMessageMap }, jsonReplacer, 4),
//       { encoding: "utf-8" }
//     );
//     console.log(`Chat metadata for user ${userId} saved successfully.`);
//   } catch (error) {
//     console.error(`Error saving chat metadata: ${error}`);
//   }
// }

// setupConfig().catch((error) => console.error(error));

// export { channelsMap, chatMessageMap };
