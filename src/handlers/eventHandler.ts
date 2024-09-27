// eventHandlers.ts
import { chatClient } from "../bot.js"; // Assuming chatClient is defined in bot.ts
import { logChatMessage, ChatMessage } from "../index.js";
let GroupArray: string[] = [];
let GroupArrayIds: string[] = [];
function handleMessage(
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
  > = [commandHandler];

  for (const handler of messageHandlers) {
    handler(channel, user, text, msg, messageMetaData);
  }

  function commandHandler(
    channel: string,
    user: string,
    text: string,
    msg: ChatMessage,
    messageMetaData: MessageMetaData
  ) {
    const command = text.split(" ")[0];
    if (!command.startsWith("!")) {
      return; // Ignore messages that aren't commands
    }

    const commandHandlers: Record<
      string,
      (channel: string, user: string, messageMetaData: MessageMetaData) => void
    > = {
      "!quit": handleQuitCommand,
      "!help": handleHelpCommand,
      // Add more commands here
    };

    const handler = commandHandlers[command];
    if (handler) {
      handler(channel, user, messageMetaData);
    } else {
      console.log(`Unknown command: ${user}: ${command}`);
    }
  }

  function handleQuitCommand(
    channel: string,
    user: string,
    messageMetaData: MessageMetaData
  ) {
    if (messageMetaData.isMod && channel === "iwdominate") {
      chatClient.quit();
      console.log(`${user} has quit the chat.`);
    }
  }

  function handleHelpCommand(channel: string, user: string) {
    chatClient.say(channel, "Available commands: !quit, !help, ...");
  }
  logChatMessage(channel, user, text, messageMetaData);
}

function handleJoin(channel: string, user: string): void {
  console.log(`${user} has joined ${channel}`);
}

// Define a type for chat message handlers
type ChatHandler = (
  channel: string,
  user: string,
  text: string,
  msg: ChatMessage
) => void;

// Function to handle chat messages
function chatHandler(
  channel: string,
  user: string,
  text: string,
  msg: ChatMessage
): void {
  // Define a map of commands and their associated handler functions
  const commandHandlers: Record<string, ChatHandler> = {
    "!hello": handleHelloCommand,

    // Add more commands and their handlers here
  };

  // Check if the message text starts with a command
  const command = text.split(" ")[0]; // Get the first word as command

  if (command in commandHandlers) {
    // Call the appropriate handler if the command is found
    commandHandlers[command](channel, user, text, msg);
  } else {
    // Handle unknown command or regular messages
    console.log(`${user} sent an unrecognized command: ${text}`);
  }
}

// Example command handler for a hello command
function handleHelloCommand(
  channel: string,
  user: string,
  text: string,
  msg: ChatMessage
): void {
  chatClient.say(channel, `Hello, ${user}! Welcome to the channel!`);
}
export { chatHandler, handleMessage };
