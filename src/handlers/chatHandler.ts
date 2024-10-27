import { ChatMessage } from "@twurple/chat";
import { saveChatMessageData } from "../utils/dataUtils.js";  // Assuming this is the correct function
import { mapTypes } from "../formatting/constants.js";

// Function to handle saving chat message data
export async function handleChatMessage(metadata: Metadata): Promise<void> {
  const userId: string | undefined = metadata.userId;
  if (!userId) throw new Error("User ID is undefined. Cannot save metadata.");

  // Type assertion: Now TypeScript knows that userId is always a string from this point
  const validUserId = userId!;

  let userData = mapTypes.USER_DATA_MAP.get(validUserId);

  // Create new user data if it doesn't exist
  if (!userData) {
    userData = {
      channelId: metadata.channelId || null,
      userId: validUserId,  // Assert that userId is defined and valid
      isMod: metadata.isMod || false,
      isVip: metadata.isVip || false,
      isBroadcaster: metadata.isBroadcaster || false,
      isSubscriber: metadata.isSubscriber || false,
      isFounder: metadata.isFounder || false,
      color: metadata.color || undefined,
      userName: metadata.userName,
      messages: []  // Initialize messages array
    };
  }

  // Ensure metadata has messages to avoid runtime errors
  if (metadata.messages && metadata.messages.length > 0) {
    const message = metadata.messages[0];  // Get the first message

    // Safely retrieve message properties
    const messageId = message?.messageId || '';
    const messageContent = message?.messageContent || '';
    const timestamp = (message?.timestamp instanceof Date) 
      ? message.timestamp.toISOString() 
      : message?.timestamp || '';

    // Add new message to the user's message array
    userData.messages.push({
      msgId: messageId,  // Ensure consistent naming (msgId vs messageId)
      messageContent: messageContent,
      timestamp: timestamp  // Ensure timestamp is a string
    });

    // Update the map with the valid userId
    mapTypes.USER_DATA_MAP.set(validUserId, userData);

    // Save the updated user data
    await saveChatMessageData(userData);
  } else {
    console.error(`No messages found for user ${metadata.userName} (ID: ${validUserId})`);
  }
}

// Function to retrieve and display a user's message history
export function getUserMessageHistory(userId: string): void {
  const userData = mapTypes.USER_DATA_MAP.get(userId);
  
  if (userData) {
    console.log(`User ${userData.userName} (ID: ${userId}) message history:`);
    userData.messages.forEach((message) => {
      console.log(`[MessageID: ${message.msgId}] ${message.messageContent} at ${message.timestamp}`);
    });
  } else {
    console.log(`No data found for user ID: ${userId}`);
  }
}
