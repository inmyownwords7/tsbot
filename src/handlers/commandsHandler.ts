import XRegExp from "xregexp"
import { api } from "../modules/auth.js"
import {banUser, isCommand, isValidUsername} from "../utils/helpers.js";
import { getUserIdFromUsername } from "../utils/userIdUtils.js";
import { botId } from "../formatting/constants.js";
import { ChatMessage } from "@twurple/chat";
import { channelsMap } from "../utils/async config.js";
import {regexLang} from "../formatting/regexp.js";
let timeoutHistory = new Map<string, number>();
let timeLastSentTimeoutMessage = new Date().getTime();

async function foreignLanguageHandler(
    channel: string,
    user: string,
    text: string,
    msg: ChatMessage
): Promise<void | boolean> {
    // Early return for null/undefined text or excluded channels
    if (!text || channel === "akanemsko") {
        return false;
    }

    // Function to remove mentions from the text
    function stripMessageOfMentions(text: string): string {
        let newMessage = "";
        let shouldInclude = true;

        for (const char of text) {
            if (char === "@") {
                shouldInclude = false;
            } else if (char === " ") {
                shouldInclude = true; // Reset flag on space
            }

            if (shouldInclude) {
                newMessage += char;
            }
        }
        return newMessage;
    }

    // Strip mentions and check for foreign language matches
    const strippedMessage = stripMessageOfMentions(text);
    const foreignMatch = strippedMessage?.match(XRegExp(`${regexLang}`, "iu")) || null;

    if (foreignMatch) {
        console.log("Match found:", foreignMatch[0]);
    } else {
        console.log("No blocked language detected.");
    }

    // Base timeout duration
    const baseDuration = 60;

    // Check if the channel has foreign language detection enabled
    if (channelsMap.get(channel)?.isForeignEnabled) {
        if (foreignMatch) {
            console.log(`${user} was flagged for saying "${foreignMatch[0]}"`);
        }

        // Skip if the user is a VIP
        if (msg?.userInfo?.isVip) {
            return;
        }

        // Handle timeout history and user actions
        const userTimeoutCount = timeoutHistory.get(user) || 0;

        if (userTimeoutCount > 0) {
            // Increment timeout duration based on history
            const timeoutDuration = baseDuration * userTimeoutCount;
            await banUser(
                channel,
                user,
                timeoutDuration,
                `You have been warned before about speaking in other languages. "${foreignMatch?.[0]}" was flagged as another language.`
            );

            timeoutHistory.set(user, userTimeoutCount + 1);
        } else {
            // Send a warning if enough time has passed since the last message
            if (new Date().getTime() - timeLastSentTimeoutMessage > 600) {
                console.log(
                    `${user} has been warned for saying: "${text}". This is an automated message.`
                );
            }

            // Update the last warning time and add the user to the timeout history
            timeLastSentTimeoutMessage = new Date().getTime();
            timeoutHistory.set(user, 1);
        }

        // Log system message (customize logger as needed)
        console.log(
            `Channel: ${channel}, User: ${user}, Text: "${text}" was flagged and handled.`
        );
    }
}

async function timeoutHandler(
    channel: string,
    text: string,
    user: string,
    msg: ChatMessage,
    userMessageMetadata: UserData,
) {

    if (!userMessageMetadata?.isMod) {
        console.error("Permission denied: User is not a moderator.");
        return;
    }

    let channels = Array.from(channelsMap.keys());
    if (!channels.includes(channel)) return;

    // Check for valid command and extract arguments
    let args = isCommand("timeout", text);

    if (!args) {
        console.error(`Invalid or unrecognized command: ${text}`);
        return;
    }

    // Validate and process arguments
    let targetUser = args[0]; // Required: target user
    if (!isValidUsername(targetUser)) {
        console.error("Error: Invalid or missing target user.");
        return;
    }

    let duration = args[1] ? parseInt(args[1], 10) || 600 : 600; // Duration with fallback
   
    if (args[1] && isNaN(parseInt(args[1], 10))) {
        console.warn(`Invalid duration provided: ${args[1]}, defaulting to 600.`);
    }
    
    let reason = args.slice(2).join(" ") || ""; // Combine remaining arguments for reason
    // Resolve channel ID
    let channelId = msg?.channelId || (await getUserIdFromUsername(channel));
    if (!channelId) {
        console.error("Error: Could not resolve channel ID.");
        return;
    }

    // Log for debugging
    console.log({
        channel,
        targetUser,
        duration,
        reason,
        channelId,
    });
    try {
        // Execute timeout
        await api.asUser(botId, (ctx) => {
            return ctx.moderation.banUser(channelId, {
                duration: duration,
                reason: reason,
                user: targetUser,
            });
        });
    } catch (error) {
        console.error(`Failed to execute timeout for ${targetUser}:`, error)
    }
}

export { timeoutHandler, foreignLanguageHandler }