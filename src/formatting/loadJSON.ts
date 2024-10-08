import path from 'path';
import * as fs from 'fs';
import { MESSAGES } from './constants.js'; // Path to your messages.json file

// Load the JSON file with localized messages
const localeData = JSON.parse(fs.readFileSync(path.resolve(MESSAGES), 'utf-8'));

// Set the default locale
const currentLocale = 'en';

/**
 * Retrieves a localized message by key and replaces placeholders
 * @param {string} key - The key for the message in the JSON (e.g., 'ban_message')
 * @param {Record<string, string>} replacements - Object with placeholder values (e.g., {user: 'John', channel: 'ChannelName'})
 * @returns {string} - The localized message with placeholders replaced
 */
function getLocalizedMessages(key: string, replacements: Record<string, string>): string {
    let message = localeData[currentLocale][key] || '';

    // Replace placeholders (e.g., {{user}}) in the message with actual values
    for (const placeholder in replacements) {
        message = message.replace(`{{${placeholder}}}`, replacements[placeholder]);
    }

    return message;
}

export { getLocalizedMessages };
