import path from "path";
import { MESSAGES, EVENT_PATH } from "./constants.js"; // Path to your messages.json file
import { promises } from "fs";

/**
 * @type {Array<{ channelName: string }>}
 */

/**
 * @type {Map<string, Object>}
 */

/**
 * Localized messages loaded from the JSON file.
 * @type {Record<string, any>}
 */
const localeData: Record<string, any> = JSON.parse(
  await promises.readFile(path.resolve(MESSAGES), "utf-8")
);

/**
 * Event messages loaded from JSON file based on the structure of EventMessages.
 * @type {EventMessages}
 */
const eventMessages: EventMessages = JSON.parse(
  await promises.readFile(path.resolve(EVENT_PATH), "utf-8")
);

// Set the default locale
/**
 * @type {string}
 */
const currentLocale: string = "en";

/**
 * Retrieves a localized message by key and replaces placeholders
 * @param {string} key - The key for the message in the JSON (e.g., 'ban_message')
 * @param {Record<string, string>} replacements - Object with placeholder values (e.g., {user: 'John', channel: 'ChannelName'})
 * @returns {string} - The localized message with placeholders replaced
 */
function getLocalizedMessages(
  key: string,
  replacements: Record<string, string>
): string {
  let message = localeData[currentLocale][key] || "";

  // Replace placeholders (e.g., {{user}}) in the message with actual values
  for (const placeholder in replacements) {
    message = message.replace(`{{${placeholder}}}`, replacements[placeholder]);
  }
  return message;
}

/**
 * Handles incoming chat messages
 * @type {void}
 */
// const messager: any = chatClient.onMessage(
//   (channel: string, user: string, text: string, msg: ChatMessage) => {
//     // Implement message handling logic here if needed
//   }
// );

/**
 * Retrieves an event message from the loaded event messages
 * @async
 * @param {keyof ModeratorEvent | keyof ConnectionEvents} messageKey - The message key to look up (e.g., 'ban_message').
 * @param {keyof ChannelEvents} categoryKey - The event category (e.g., 'moderatorEvent' or 'connectionEvents').
 * @param {Record<string, string>} replacements - Object with placeholder values (e.g., {user: 'John', channel: 'ChannelName'}).
 * @returns {Promise<string>} - A formatted message with placeholders replaced.
 */
async function getEventMessages(
  messageKey:  keyof ChannelEvents, 
  categoryKey: keyof ModeratorEvents | keyof ConnectionEvents, 
  replacements: Record<string, string>
): Promise<string> {

  // Retrieve the category (e.g., 'moderatorEvent' or 'connectionEvents')
  const eventCategory = eventMessages[categoryKey];

  if (!eventCategory) {
    throw new Error(`Category ${categoryKey} does not exist in event messages.`);
  }

  // Depending on the category, select the appropriate type
  let message = "";

  // Type narrowing based on the existence of 'moderatorEvent' or 'connectionEvents'
  if ("moderatorEvent" in eventCategory && eventCategory.moderatorEvent) {
    // If the category is 'moderatorEvent', use the messageKey from ModeratorEvent
    message = eventCategory.moderatorEvents[messageKey as keyof ModeratorEvents] ?? "";
  } else if ("connectionEvents" in eventCategory && eventCategory.connectionEvents) {
    // If the category is 'connectionEvents', use the messageKey from ConnectionEvents
    message = eventCategory.connectionEvents[messageKey as keyof ConnectionEvents] ?? "";
  }
  
  if (!message) {
    throw new Error(`Message key ${messageKey} does not exist in ${categoryKey}.`);
  }

  // Replace placeholders in the message with actual values
  for (const text in replacements) {
    message = message.replace(`{{${text}}}`, replacements[text]);
  }

  return message;
}

// Export the functions
export { getLocalizedMessages, getEventMessages };
