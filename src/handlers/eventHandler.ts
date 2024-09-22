// eventHandlers.ts
import { ChatMessage } from "@twurple/chat"; // Import necessary types
import { chatClient } from '../bot.js'; // Assuming chatClient is defined in bot.ts

export function handleJoin(channel: string, user: string): void {
  console.log(`${user} has joined ${channel}`);
}

export function handleMessage(channel: string, user: string, text: string, msg: ChatMessage): void {
  console.log(`[${channel}] ${user}: ${text}`);
}

export function handleSub(channel: string, user: string, subInfo: any, msg: any): void {
  console.log(`${user} just subscribed in ${channel}! Subscription details: ${JSON.stringify(subInfo)}`);
}

// Define a type for chat message handlers
export type ChatHandler = (
  channel: string,
  user: string,
  text: string,
  msg: ChatMessage
) => void;

// Function to handle chat messages
export function chatHandler(
  channel: string,
  user: string,
  text: string,
  msg: ChatMessage
): void {
  // Define a map of commands and their associated handler functions
  const commandHandlers: Record<string, ChatHandler> = {
    '!hello': handleHelloCommand,
 
    // Add more commands and their handlers here
  };

  // Check if the message text starts with a command
  const command = text.split(' ')[0]; // Get the first word as command

  if (command in commandHandlers) {
    // Call the appropriate handler if the command is found
    commandHandlers[command](channel, user, text, msg);
  } else {
    // Handle unknown command or regular messages
    console.log(`${user} sent an unrecognized command: ${text}`);
  }
}

// Example command handler for a hello command
export function handleHelloCommand(
  channel: string,
  user: string,
  text: string,
  msg: ChatMessage
): void {
  chatClient.say(channel, `Hello, ${user}! Welcome to the channel!`);
}

