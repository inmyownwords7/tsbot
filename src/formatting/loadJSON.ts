import path from "path";
import { promises } from "fs";
import { MESSAGES, EVENT_PATH } from "./constants.js"; // Path to your messages.json file

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
const currentLocale = "en";

/**
 * Retrieves a localized message by key and replaces placeholders.
 * @param {string} key - The key for the message in the JSON (e.g., 'ban_message').
 * @param {Record<string, string>} replacements - Object with placeholder values (e.g., {user: 'John', channel: 'ChannelName'}).
 * @returns {string} - The localized message with placeholders replaced.
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
 * Retrieves an event message from the loaded event messages.
 * @async
 * @param {keyof ChannelEvents} categoryKey - The event category (e.g., 'moderatorEvents' or 'connectionEvents').
 * @param {keyof ModeratorEvents | keyof SubscriptionEvents | keyof ConnectionEvents | keyof GeneralEvents} messageKey - The message key to look up (e.g., 'ban_message').
 * @param {Record<string, string>} replacements - Object with placeholder values (e.g., {user: 'John', channel: 'ChannelName'}).
 * @returns {Promise<string>} - A formatted message with placeholders replaced.
 */
async function getEventMessages(
  categoryKey: keyof ChannelEvents,
  messageKey: keyof ModeratorEvents | keyof SubscriptionEvents | keyof ConnectionEvents | keyof GeneralEvents,
  replacements: Record<string, string>
): Promise<string> {
  // Retrieve the event category (e.g., 'moderatorEvents', 'subscriptionEvents', etc.)
  const eventCategory = eventMessages[categoryKey];

  if (!eventCategory) {
    throw new Error(`Category '${categoryKey}' does not exist in event messages.`);
  }

  let message: string | undefined;

  // Access the specific message within the event category based on messageKey
  switch (categoryKey) {
    case "moderatorEvents": {
      const moderatorEvents = eventCategory.moderatorEvents;
      message = moderatorEvents[messageKey as keyof ModeratorEvents];
      break;
    }
    case "subscriptionEvents": {
      const subscriptionEvents = eventCategory.subscriptionEvents;
      message = subscriptionEvents[messageKey as keyof SubscriptionEvents];
      break;
    }
    case "connectionEvents": {
      const connectionEvents = eventCategory.connectionEvents;
      message = connectionEvents[messageKey as keyof ConnectionEvents];
      break;
    }
    case "generalEvents": {
      const generalEvents = eventCategory.generalEvents;
      message = generalEvents[messageKey as keyof GeneralEvents];
      break;
    }
    default:
      throw new Error(`Category '${categoryKey}' is not recognized.`);
  }

  if (!message) {
    throw new Error(`Message key '${messageKey}' does not exist in category '${categoryKey}'.`);
  }

  // Replace placeholders in the message with actual values
  for (const placeholder in replacements) {
    message = message.replace(`{{${placeholder}}}`, replacements[placeholder]);
  }

  return message;
}

// Export the functions
export { getLocalizedMessages, getEventMessages };
