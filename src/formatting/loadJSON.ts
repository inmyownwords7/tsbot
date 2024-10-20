import path, { resolve } from "path";
import * as fs from "fs/promises";
import { MESSAGES, EVENT_PATH } from "./constants.js"; // Path to your messages.json file
import { jsonReplacer, jsonReviver } from "@utils/helpers.js";
import { promises } from "fs";
// Load the JSON file with localized messages
//JSON Reviver is used as a 2nd argument of JSON.parse
const localeData = JSON.parse(await promises.readFile(path.resolve(MESSAGES), "utf-8"));
const eventMessages = JSON.parse(await promises.readFile(path.resolve(EVENT_PATH), "utf-8"));
// Set the default locale
const currentLocale = "en";

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

async function getEventMessages(
  messageKey: string,
  categoryKey: string,
  replacements: Record<string, string>
): Promise<string> {
  let message = eventMessages[categoryKey]?.[messageKey] || "";

  for (const text in replacements) {
    message = message.replace(`{{${text}}}`, replacements[text]);
  }

  return message;
}

(async () => {

})

export { getLocalizedMessages, getEventMessages };
