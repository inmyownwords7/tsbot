import XRegExp from "xregexp"
import { ChatMessage } from "@twurple/chat";
import { api } from "../modules/auth.js"
import { banUser, isCommand, isValidUsername } from "../utils/helpers.js";
import { getUserIdFromUsername } from "../utils/userIdUtils.js";
import { BOT_ID } from "../formatting/constants.js";
import { channelsMap } from "../utils/async config.js";
import { regexLang } from "@src/formatting/regexp.js";
import { get } from "node_modules/axios/index.cjs";
import { HelixUser } from "@twurple/api";

let timeoutHistory = new Map<string, number>();
let timeLastSentTimeoutMessage = new Date().getTime();

async function foreignLanguageHandler(
    channel: string,
    user: string,
    text: string,
    msg: ChatMessage
): Promise<void | boolean> {
    let { isMod, isSubscriber, isVip, isBroadcaster } = msg.userInfo

    const staff: Staff = {
        isMod: isMod,
        isSubscriber: isSubscriber,
        isVip: isVip,
        isBroadcaster: isBroadcaster,
    }

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
        // console.log("No blocked language detected.");
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

        if (msg?.userInfo?.isMod) {
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
    userMessageMetadata: UserData
) {
    if (!userMessageMetadata?.isMod) {
        console.error("Permission denied: User is not a moderator.");
        return;
    }
    console.log(text)

    let args = isCommand("!timeout", text);
    if (!args) return;

    const [targetUser, rawDuration, ...reasonParts] = args;
    console.log(targetUser + " " + rawDuration + " " + reasonParts)
    const duration = parseInt(rawDuration, 10) || 600; // Default to 600 seconds
    const reason = reasonParts.join(" ");

    if (!isValidUsername(targetUser)) {
        console.error("Invalid or missing target user.");
        return;
    }
    let userObject: HelixUser | null = await getUserIdFromUsername(targetUser);
    if(!userObject) {
        return;
    }
    let id: string = userObject?.id
    const channelId = msg?.channelId || (await getUserIdFromUsername(channel));
    if (!channelId) {
        console.error("Failed to resolve channel ID.");
        return;
    }

    console.log(`Timeout: ${targetUser} ${id} for ${duration}s. Reason: ${reason}`);

    try {
        await api.asUser(BOT_ID, (ctx) =>
            ctx.moderation.banUser(channelId, {
                user: id,
                duration,
                reason,
            })
        );
    } catch (error) {
        console.error(`Failed to timeout ${targetUser}:`, error);
    }
}

export { timeoutHandler, foreignLanguageHandler }