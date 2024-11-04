import { hasRequiredPermission } from "./permissionRights.js";
import { api } from "modules/auth.js";
import { botId } from "formatting/constants.js";
import { chatClient } from "../bot.js";
import { ChatMessage } from "@twurple/chat";

function timeoutHandler(
  channel: string,
  user: string,
  userMessageMetadata: UserData,
  data?: { duration: number; reason: string; targetUser: string }
): void {
  if (!data) {
    console.error("Missing timeout data.");
    return;
  }

  const { duration, reason, targetUser } = data;
  const requiredLevel = 10;
  const canAccessFeature = hasRequiredPermission(userMessageMetadata, requiredLevel);

  if (!canAccessFeature) {
    // chatClient.say(channel, `Sorry, ${user}, you do not have permission to timeout users.`);
    return;
  }

  api.asUser(botId, async (context) => {
    try {
      await context.moderation.banUser(channel, { duration, reason, user: targetUser });
      console.log(`User ${targetUser} has been timed out (banned) for ${duration} seconds by ${user} for reason: ${reason}`);
      // chatClient.say(channel, `${targetUser} has been timed out for ${duration} seconds.`);
    } catch (error) {
      console.error(`Failed to timeout ${targetUser}: ${error}`);
      // chatClient.say(channel, `Unable to timeout ${targetUser}. Please try again.`);
    }
  });
}

// Handler for the !quit command
function quitChatHandler(channel: string, user: string, userMessageMetadata: UserData): void {
  if (userMessageMetadata.isMod || userMessageMetadata.isBroadcaster) {
    chatClient.quit();
    console.log(`${user} has quit the chat.`);
    // chatClient.say(channel, `${user} has ended the bot session.`);
  } else {
    // chatClient.say(channel, `Sorry, ${user}, you do not have permission to quit the chat.`);
  }
}

// Handler for the !help command
function helpCommandHandler(channel: string, user: string): void {
  const availableCommands = "!quit, !help, !timeout"; // Update this list as needed
  // chatClient.say(channel, `Available commands: ${availableCommands}`);
}

// Example usage in the executeCommand function
function executeCommand(
  channel: string,
  user: string,
  text: string,
  msg: ChatMessage,
  userMessageMetadata: UserData
): void {
  const command = text.split(" ")[0];
  if (!command.startsWith("!")) return;

  const commandPermissions: Record<string, number> = {
    "!quit": 10,
    "!help": 5,
    "!timeout": 10,
  };

  const requiredLevel = commandPermissions[command] || 5;
  const canAccessFeature = hasRequiredPermission(userMessageMetadata, requiredLevel);

  if (!canAccessFeature) {
    // chatClient.say(channel, `Sorry, ${user}, you do not have permission to use this command.`);
    return;
  }

  const commandHandlers: Record<
    string,
    (channel: string, user: string, userMessageMetadata: UserData, data?: any) => void
  > = {
    "!quit": quitChatHandler,
    "!help": helpCommandHandler,
    "!timeout": timeoutHandler,
  };

  const handler = commandHandlers[command];
  if (handler) {
    if (command === "!timeout") {
      const args = text.split(" ");
      const targetUser = args[1];
      const duration = parseInt(args[2]) || 300;
      const reason = args.slice(3).join(" ") || "No reason provided";
      
      handler(channel, user, userMessageMetadata, { duration, reason, targetUser });
    } else {
      handler(channel, user, userMessageMetadata);
    }
  } else {
    console.log(`Unknown command: ${user}: ${command}`);
  }
}

export {timeoutHandler}