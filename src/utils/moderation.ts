/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
// @ts-check
import { botId, authProvider } from '../auth.js'
// import { botId } from '../auth.js'
// import { createAuthProvider } from '../Db/authDb.js'
import { ApiClient, UserNameResolvable, UserIdResolvable, UserNameResolvable, UserIdResolvable, HelixPaginatedResult, HelixPrediction } from '@twurple/api'
// import { chatClient } from "../bot.js";
import path, { sep } from 'path'
import { variable } from './Variables.js'
import { GroupArray } from './Groups.js'
// import { GroupArray } from './Groups.js'
// import { user } from '../models/users';
// import { api } from './utils';
// import { EventSubMiddleware } from '@twurple/eventsub-http';

//   const authProvider = await createAuthProvider()
//   return authProvider
// }
export const api = new ApiClient({ authProvider })

// export const apiWithoutUser = new ApiClient({ authProvider })
// console.log(apiWithoutUser)
export const moderateApi = api.moderation
export const chatApi = api.chat
export const streamApi = api.streams
export const whisperApi = api.whispers
export const userApi = api.users
export const clipApi = api.clips
export const predictionApi = api.predictions
export const eventApi = new ApiClient({ authProvider })
export const channelApi = api.channels

async function extractIdFromUser(user: UserNameResolvable) {
    user = user.replace('@', '')

    try {
        if (!user) {
            return false
        } else if (user) {
            const userResult = await userApi.getUserByName(user)

            if (!userResult) {
                return false
            } else {
                return userResult.id
            }
        }
    } catch (error) {
        console.error(error)
    }
}
// api.registerEvent(api.eventSub.subscribeToStreamOnlineEvents(await extractIdFromUser('akanemsko')))
// const result = await api.eventSub.subscribeToChannelBanEvents(broadcaster, () => {
//     console.log(result)
// })

async function extractUserFromId(user: UserIdResolvable) {
    const userType = await userApi.getUserById(user)
    return userType.name
}

/** @function @param {string[]} [userGroup = GroupArray]  */
async function extractIdsFromUser(userGroup = GroupArray) {
    const userIds = []
    for (let x = 0; x < userGroup.length - 1; x++) {
        const id = await extractIdFromUser(userGroup[x])
        userIds.push(id)
    }
    // console.log(userIds.filter((id) => (id)))
    return userIds.filter((id) => (id))
}

async function HelixUserDate(user: UserNameResolvable) {
    const userResult = await userApi.getUserByName(user)
    return userResult.creationDate
}

async function banUser(channel: any, user: any, number: string | null, explanation: string, msg: { channelId: string; userInfo: { userId: string } }) {
    // console.log(channel, user)
    console.log('params:', channel, user, number, explanation)
    const channelId = msg.channelId
    console.log(msg.channelId + ' this is the channel')
    console.log(msg.userInfo.userId + ' this is the id of the speaker.')
    // sometimes msg.channelId can be undefined, like if it originated in a whisper
    // if (!channelId) {
    //   channelId = await extractIdFromUser(channel);
    // }

    /*   if (await checkUserBan(channelId, user_Id)) {
        console.log("not banning cause user already banned");
        return
      } */

    try {
        const user_Id = await extractIdFromUser(user)
        console.log('ids:', channelId, user_Id)
        if (user_Id === undefined) {
            return false
        }
        console.log('user_Id', user_Id, 'channelId', channelId)
        if (number === 'perm') {
            number = null
        }

        if (channelId === undefined) {
            return false
        }

        console.log(`Supposed parameters for the command is ${channelId} ${user_Id}`)
        await api.asUser(botId, async ctx => ctx.moderation.banUser(channelId, {
            duration: number,
            reason: explanation,
            user: user_Id
        }))
    } catch (error) {
        console.error('Error while banning user ' + error)
    }
}

// async function banUser(channel, user, number, explanation, msg) {
//   let channelId = msg.channelId;
//   await api.asUser(moderator, async ctx => await ctx.moderation.banUser(channelId, { duration: number, reason: explanation, user: user_Id }))
// }

async function checkUserBan(channelId: UserIdResolvable, userId: UserIdResolvable) {
    console.log(channelId, userId)
    return await moderateApi.checkUserBan(channelId, userId)
}

// user is considered the person being timed out. removed number and explanation because it was not required
/*
async function banMultipleUsers(channel, users, index = 0) {
  banUser(channel, users[index], "perm", "you were on a ban list")
  if(users.length > 1) {
    index++;
    }
  if (users[index + 1]) {
    setTimeout(() => banMultipleUsers((channel, users, index + 1), 500)
    )
  }
}
*/

function banMultipleUsers(channel: any, users: any[], msg: any, index = 0) {
    banUser(channel, users[index], null, '', msg)
    if (users[index + 1]) {
        setTimeout(() => {
            banMultipleUsers(channel, users, msg, index + 1);
            console.log('banning next user')
        }, 500)
    }
}

function stripMessageOfMentions(text: any) {
    let newMessage = ''
    let shouldInclude = true
    try {
        for (const char of text) {
            if (char === '@' || char === 'ㅋ') {
                shouldInclude = false
            }

            if (char === '') {
                shouldInclude = true
            }

            if (shouldInclude) {
                newMessage += char
            }
        }
        return newMessage
    } catch (error) {
        console.error(error)
    }
}

function getChannelResponses(channels: any[]) {
    return channels.filter((channel: { channel: any }) => {
        if (channel.channel === channel) {
            return true
        }
    })
}

// @Comment: Comment
async function removeBlockedWord(channel: any, id: string) {
    // id in this case is the word you want to remove.
    const channelId = await extractIdFromUser(channel)
    return await moderateApi.removeBlockedTerm(channelId, botId, id)
}

async function addBlockedTerm(channel: any, id: any) {
    // id is the word you want to add to the channel.
    const channelId = await extractIdFromUser(channel)
    return await moderateApi.addBlockedTerm(channelId, botId, id)
}

async function getBlockedTerms(channel: any, after: any, limit: any) {
    const pagination = { after, limit }
    const channelId = await extractIdFromUser(channel)
    return await moderateApi.getBlockedTerms(channelId, botId, pagination)
}

// async function deleteWord(channel, msg) {
//   let channelId = await extractIdFromUser(channel)
//   return await moderateApi.deleteChatMessages(channelId, msg.id)
// }
//   return await moderateApi.asUser(botId,
//     async ctx = await ctx.moderation.deleteChatMessages(broadcaster, msg.id)
//     channelId, msg.id)
// }
async function deleteWord(channel: any, msg: { id: string | undefined }) {
    const channelId = await extractIdFromUser(channel)
    // const channelId = msg.channelId
    return await api.asUser(
        botId,
        async ctx => await ctx.moderation.deleteChatMessages(channelId, msg.id)
    )
}

async function whispers(userName: any, text: string) {
    const userId = await extractIdFromUser(userName)
    return await whisperApi.sendWhisper(botId, userId, text)
}

async function createClip(channel: any, createAfterDelay: any) {
    try {
        const channelId = await extractIdFromUser(channel)
        console.log('id result', channelId)

        return await clipApi.createClip({ channel: channelId, createAfterDelay })
    } catch (error) {
        console.error(error)
    }
}

async function getClip(id: string) {
    return await clipApi.getClipById(id)
}

// TODO Predictions contains issues. Awaiting help from support group.
async function createPrediction(broadcaster: any, duration: any, title: any) {
    const broadcaster_id = await extractIdFromUser(broadcaster)
    return await predictionApi.createPrediction(broadcaster_id, { autoLockAfter: duration, outcomes: [], title })
}

async function getPredictions(broadcaster: Promise<HelixPaginatedResult<HelixPrediction>>) {
    const broadcasterId = await extractIdFromUser(broadcaster)
    const id = getPredictions(id)
    return await predictionApi.getPredictions(broadcasterId, id)
}

async function cancelPrediction(broadcaster: any) {
    const broadcasterId = await extractIdFromUser(broadcaster)
    const id = getPredictions(id)
    return await predictionApi.cancelPrediction(broadcasterId, id)
}

async function resolvePredictions(broadcaster: any, outcomeId: string) {
    const broadcasterId = await extractIdFromUser(broadcaster)
    const id = getPredictions(id)
    // outcomeId win or lose;
    return await predictionApi.resolvePrediction(broadcasterId, id, outcomeId)
}

// commands are in global cooldown restricts how often commands procs.
function cooldown() {
    if (new Date().getTime() - timeLastSentTimeoutMessage > 600) {
        // TODO document why this block is empty

    } else {
        // TODO document why this block is empty

    }
}

function isCooldownExpired(lastCallTime: number, customCooldownTime = (180 * variable.m)) {
    const currentTime = new Date().getTime()
    const cooldownTime = customCooldownTime
    // const cooldownTime = customCooldownTime || 180 * variable.m
    const timeDifference = currentTime - lastCallTime
    // return currentTime - lastCallTime > cooldownTime;
    return timeDifference >= cooldownTime
}

function isOffCooldown(lastResponseTime: number, cooldownDuration: number) {
    if (user.toLowerCase() === 'trtld') {
        return true
    }

    const timeSinceLastResponse = new Date().getTime() - lastResponseTime
    if (timeSinceLastResponse > cooldownDuration) {
        return true
    }
}

// replace command with the string of !{rest of command}
// takes !command and text remains text.

function isCommand(command: string | any[], text: string) {
    if (text.substring(0, command.length) === command) {
        const args = text.substring(command.length + 1, text.length).split(' ')
        return args || true
    }
    return false
}

function modCommand(STRINGSTART: any, text: any, messageMetaData: { isMod: any }) {
    if (!messageMetaData.isMod) return false
    return isCommand(STRINGSTART, text)
}

function deputyCommand(STRINGSTART: any, text: any, messageMetaData: { isDeputy: any }) {
    if (!messageMetaData.isDeputy) return false
    return isCommand(STRINGSTART, text)
}

async function announce(announcement: any, msg: { channelId: any }) {
    // let channelId = await extractIdFromUser(channel)
    const channelId = msg.channelId
    if (channelId === undefined) {
        return false
    }
    return await chatApi.sendAnnouncement(channelId, botId, { color: null, message: announcement })
}

async function checkUserVipOrModerator(channel: any, user: any) {
    const channelId = await extractIdFromUser(channel)
    const user_Id = await extractIdFromUser(user)
    return await channelApi.checkVipForUser(channelId, user_Id)
}

/** @RelativePath @param {currentWorkingDirector} from @param {dirToImportFrom} to  */
function relativePath(from: string, to: string) {
    return path.relative(from, to)
}

/** @param array can be @array = []  */
function absolutePath(from: string, to: string) {
    return path.resolve(from, to)
}

function isTextStarting(pattern: any, text: string) {
    const startString = text.startsWith(pattern)
    return startString
}

function getDataType(string: any) {
    return string
}

function splitPath(path: any) {
    // 'foo/bar/baz'.split(path.sep);
    // Returns: ['foo', 'bar', 'baz']
    return sep(path)
}

async function isStreamOnline(channel: any) {
    try {
        // channel = channel.replace(/#/g, '')
        const broadcasterId = await extractIdFromUser(channel)
        let stream = await api.streams.getStreamByUserId(broadcasterId);
        //console.log(stream?.startDate ? true : false)
        return stream?.startDate ? true : false
    } catch (error) {
        console.error(error)
    }
}

export {
    extractIdFromUser,
    banUser,
    banMultipleUsers,
    stripMessageOfMentions,
    getChannelResponses,
    removeBlockedWord,
    deleteWord,
    getBlockedTerms,
    addBlockedTerm,
    whispers,
    createClip,
    getClip,
    createPrediction,
    getPredictions,
    cancelPrediction,
    resolvePredictions,
    cooldown,
    isOffCooldown,
    // isStreamOnline, announce, isCommand, checkUserVipOrModerator,
    announce,
    isCommand,
    checkUserVipOrModerator,
    checkUserBan,
    HelixUserDate,
    relativePath,
    extractUserFromId,
    isTextStarting,
    isCooldownExpired,
    modCommand,
    deputyCommand,
    getDataType,
    absolutePath,
    splitPath,
    extractIdsFromUser,
    isStreamOnline
}