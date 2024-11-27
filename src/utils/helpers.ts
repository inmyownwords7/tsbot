import path from "path";
import chalk, {ChalkInstance} from "chalk";
import {roleToRoleColor} from "../modules/logger.js";
import {channelsMap} from "./async config.js";
import {getUserIdFromUsername, getUserNameFromUserId} from "./userIdUtils.js";
import {botId} from "../formatting/constants.js";
import {userId} from "../index.js";
import {api} from "../modules/auth.js";
import {HelixUser} from "@twurple/api";

// let baseMessage: string = `${metadata.timestamp} ${metadataString} [CHAT ${level}]: ${message}`;

function isCommand(
    commands: string | string[],
    text: string
): string[] | false {
    // Convert commands to an array if it's a single string
    const commandArray = Array.isArray(commands) ? commands : [commands];

    // Loop through each command in the commandArray
    for (const command of commandArray) {
        // Check if the text starts with the current command
        if (text.trim().toLowerCase().startsWith(command.toLowerCase())) {
            // Extract and return the arguments following the command as an array
            const args = text.substring(command.length).trim().split(/\s+/); // Split by whitespace
            return args; // Return the arguments if found
        }
    }
    // Return false if no command matches
    return false;
}

function modCommand(
    STRINGSTART: string | string[],
    text: string,
    userMessageMetadata: { isMod: boolean }
) {
    if (!userMessageMetadata.isMod) return false;
    return isCommand(STRINGSTART, text);
}

function deputyCommand(
    STRINGSTART: string | string[],
    text: string,
    userMessageMetadata: { isDeputy: boolean }
) {
    if (!userMessageMetadata.isDeputy) return false;
    return isCommand(STRINGSTART, text);
}

function absolutePath(from: string, to: string): string {
    return path.resolve(from, to);
}

function searchPattern(pattern: string | string[], text: string): boolean {
    if (Array.isArray(pattern)) {
        return pattern.some((p) => new RegExp(p, "i").test(text));
    }

    const regex = new RegExp(pattern, "i"); // Create a regex pattern with case-insensitive flag
    return regex.test(text); // Returns true if the pattern is found, otherwise false
}

function formatTimeComponent(value: number, label: string) {
    return `${value} ${label}${value !== 1 ? "s" : ""}`;
}

function formatUptime(botTime: number) {
    const timeComponents = [];

    if (botTime >= 86400 * 30.44) {
        const months = Math.floor(botTime / (86400 * 30.44));
        botTime -= months * (86400 * 30.44);
        timeComponents.push(formatTimeComponent(months, "month"));
    }

    if (botTime >= 604800) {
        const weeks = Math.floor(botTime / (86400 * 7));
        botTime -= weeks * (86400 * 7);
        timeComponents.push(formatTimeComponent(weeks, "week"));
    }

    if (botTime >= 86400) {
        const days = Math.floor(botTime / 86400);
        botTime -= days * 86400;
        timeComponents.push(formatTimeComponent(days, "day"));
    }

    if (botTime >= 3600) {
        const hours = Math.floor(botTime / 3600);
        botTime -= hours * 3600;
        timeComponents.push(formatTimeComponent(hours, "hour"));
    }

    if (botTime >= 60) {
        const minutes = Math.floor(botTime / 60);
        botTime -= minutes * 60;
        timeComponents.push(formatTimeComponent(minutes, "minute"));
    }

    if (botTime > 0) {
        timeComponents.push(formatTimeComponent(botTime, "second"));
    }
    return timeComponents.join(", ");
}

function botUptime() {
    const botTime = Math.floor(process.uptime());
    const formattedUptime = formatUptime(botTime);
    // Regex is required below because the general font color is blue.
    // eslint-disable-next-line no-control-regex
    return formattedUptime.replaceAll(/\[3[^ ]m/g, "");
}

async function banUser(channel: string, user: string, duration: number, reason: string) {
    let channelId: HelixUser | null = await getUserIdFromUsername(channel)
    let userId: HelixUser | null = await getUserIdFromUsername(user);
    if (!userId) {
        return;
    }

    if (!channelId) {
        return;
    }

    await api.asUser(botId, async (ctx) => {
        return ctx.moderation.banUser(channelId, {
            duration: duration,
            reason: reason,
            user: userId?.id
        })
    })
}

setInterval(() => {
    botUptime();
}, 60000);

// call systemHandler here to restart bot in case of crash or disconnect.
// setInterval(() => {
//     checkForAndAnnounceNewTweet();
// }, (TWEET_TIMER * variable.m));//every 10 sec
// reset();

// function formatUptime(botTime) {
// const timeComponents = [];

// if (botTime >= 86400 * 30.44) {
//   const months = Math.floor(botTime / (86400 * 30.44));
//   botTime -= months * (86400 * 30.44);
//   timeComponents.push(formatTimeComponent(months, 'month'));
// }

// if (botTime >= 604800) {
//   const weeks = Math.floor(botTime / (86400 * 7));
//   botTime -= weeks * (86400 * 7);
//   timeComponents.push(formatTimeComponent(weeks, 'week'));
// }

// if (botTime >= 86400) {
//   const days = Math.floor(botTime / 86400);
//   botTime -= days * 86400;
//   timeComponents.push(formatTimeComponent(days, 'day'));
// }

// if (botTime >= 3600) {
//   const hours = Math.floor(botTime / 3600);
//   botTime -= hours * 3600;
//   timeComponents.push(formatTimeComponent(hours, 'hour'));
// }

// if (botTime >= 60) {
//   const minutes = Math.floor(botTime / 60);
//   botTime -= minutes * 60;
//   timeComponents.push(formatTimeComponent(minutes, 'minute'));
// }

// if (botTime > 0) {
//   timeComponents.push(formatTimeComponent(botTime, 'second'));
// }

// return colors.yellow(timeComponents.join(', '));
// }
// function botUptime() {
//   const botTime = Math.floor(process.uptime());
//   console.log(botTime)
//   // const formattedUptime = formatUptime(botTime);
//   // Regex is required below because the general font color is blue.
//   // eslint-disable-next-line no-control-regex
//   // return colors.blue(formattedUptime.replaceAll(/\[3[^ ]m/g, ''));
// }

// async function startChecking(toggle) {
//   try {
//     if (toggle) {
//       toggle = false;
//     } else isOnline = await isStreamOnline('iwdominate');
//     if (isOnline && toggle) {
//       //console.log("checking")
//       return true;
//     } else {
//       //console.log("nope")
//       return false;
//     }
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// }
// async function repeatMessage(toggle) {
//   try {
//     if (toggle) {
//       return false;
//     } else isOnline = await isStreamOnline('iwdominate');
//     if (isOnline && toggle) {
//       console.log('checking');
//       streamerToLogger['iwdominate'].alert(
//         'iwdominate: Please join the ESB Discord @ https://discord.gg/XMZKWv5D for a chance to win $20 USDT'
//       );
//       chatClient.say(
//         'iwdominate',
//         'Please join the ESB Discord @ https://discord.gg/XMZKWv5D for a chance to win $20 USDT'
//       );
//       return true;
//     } else {
//       console.log('nope');
//       return false;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// function schedulePeriodicCheck() {
//   startChecking();
//   // setTimeout(() => {
//   //   schedulePeriodicCheck();
//   // }, 1 * 60 * 1000); // 15 minutes in milliseconds
//   // setInterval(() => {
//   //   chatClient.say('iwdominate', "Please join the ESB Discord @ https://discord.gg/XMZKWv5D for a chance to win $20 USDT");
//   // }, INTERVALDURATION)

//   setInterval(repeatMessage, INTERVALDURATION);
//   setInterval(startChecking, 60 * 1000); // Repeat every 1 minutes
// }

// if (toggle) {
//   schedulePeriodicCheck();
// }
function setColor(
    color: string | undefined | null,
    channel: string
): string | undefined | null {
    let oldColor: string | undefined | null = channelsMap.get(channel)?.logColor;
    oldColor = color;
    return oldColor;
}

// Helper function to determine baseColorInstance based on roles
function getRoleBasedColor(metadata: UserData): ChalkInstance {
    if (metadata?.isMod) return roleToRoleColor.get("moderator") ?? chalk.white;
    if (metadata?.isVip) return roleToRoleColor.get("vip") ?? chalk.white;
    if (metadata?.isSubscriber)
        return roleToRoleColor.get("subscriber") ?? chalk.white;
    return chalk.white; // Default to white
}

function jsonReplacer(key: string, value: unknown): unknown {
    if (value instanceof Map) {
        return {
            dataType: "Map",
            value: Array.from(value.entries()),
        };
    }
    return value;
}

// JSON reviver for deserialization
/**
 * Description placeholder
 * @event date 1:09:20 pm
 *
 * @param {string} key
 * @param {*} value
 * @returns {*}
 */
function jsonReviver(key: string, value: unknown): unknown {
    if (
        typeof value === "object" &&
        value !== null &&
        (value as { dataType?: string }).dataType === "Map"
    ) {
        return new Map((value as { value: [string, unknown][] }).value);
    }
    return value;
}

function isValidUsername(username: string): boolean {
    return /^[a-zA-Z0-9_]{3,25}$/.test(username);
}

// Use this helper in the logging function
// const formattedMessage = getRoleBasedColor(metadata)(baseMessage);
export {
    isValidUsername,
    absolutePath,
    searchPattern,
    modCommand,
    deputyCommand,
    isCommand,
    formatUptime,
    setColor,
    jsonReplacer,
    jsonReviver,
    banUser
};
