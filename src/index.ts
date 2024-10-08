/// <reference path="../types.d.ts" />
/**
 * TODO setup bot token. Use environment variables. Apply processCommandOrMessages
 * Must also implement a count system for the groups.
 * Add an option to specify the groups in the bot config.
 * @constants is located in a separate file. constants.ts
 */
import * as fs from "fs";
import * as path from "path";

import regexp from "xregexp";
import { RefreshingAuthProvider } from "@twurple/auth";
import { ApiClient ,UserIdResolvable as userId } from "@twurple/api";
import {
  ChatClient,
  ChatCommunitySubInfo,
  ChatMessage,
  ChatSubExtendInfo,
  ChatSubInfo,
  UserNotice
} from "@twurple/chat";
// import { api } from "./modules/auth.js";
import * as authProvider from "./modules/auth.js";
import * as channelsMap from "./utils/async config.js";
import * as colors from "./formatting/chalk.js";
import { DATE_FORMAT } from "./formatting/constants.js";
import * as logger from "./modules/logger.js";

import {
  processChatMessage
} from "./handlers/eventHandler.js";

import { logChatMessage } from "./modules/logger.js";
  // chatClient.onAuthenticationSuccess(() => {
  //   const STARTING_TIME: string = moment().format('h:mm:ss a')
  //   // this only works because bot starting time is static.
  //     console.log('Bot has started on ' + STARTING_TIME)
  //     console.log(colors.system('Successfully registered!'));
  //     console.log(colors.system('Listening for channel changes. '));

  //   setInterval(() => {
  //     botUptime();
  //   }, 60000);
    // call systemHandler here to restart bot in case of crash or disconnect.
    // setInterval(() => {
    //     checkForAndAnnounceNewTweet();
    // }, (TWEET_TIMER * variable.m));//every 10 sec
    // reset();
  // });

  // chatClient.onChatClear((channel, msg) => {
    // console.log(colors.error(`a moderator in ${channel} has cleared the chatClient with ${msg.command} at ${msg.date}`))
    // loggers.syslogs.info(
    //   colors.error(
    //     `a moderator in ${channel} has cleared the chatClient with ${msg.command
    //     } at ${time.now()}`
    //   )
    // );
  // });
  
  // chatClient.onPart((channel, user) => {
    // console.log(channel, user);
  //   streamerToLogger[channel].info(channel, user);
  // });

  // chatClient.onWhisper((user, text, msg) => {
  //   const messageMetaData = {
    //   // booleans
    //   isMod: msg.userInfo.isMod,
    //   isVip: msg.userInfo.isVip,
    //   isBroadcaster: msg.userInfo.isBroadcaster,
    //   isParty:
    //     GroupArray.includes(user) || GroupArrayIds.includes(msg.userInfo.id),
    //   isStaff: msg.userInfo.isMod || msg.userInfo.isBroadcaster,
    //   // broadcasterId
    //   isDeputy:
    //     GroupArray.includes(user) || GroupArrayIds.includes(msg.userInfo.id),
    // };

    // loggers.dmLogger.info(
    //   colors.cyan(`${time.now()}: ${user}: said ${text}`)
    // );
    // timeoutHandler(null, user, text, msg, messageMetaData);
    // unbanHandler(null, user, text, msg, messageMetaData);
    // // default to tfblade's channel
    // banMultipleHandler('tfblade', user, text, msg, messageMetaData);
  // });
export {
  authProvider,
  channelsMap,
  colors,
  DATE_FORMAT,
  logger,
  ChatClient,
  ChatCommunitySubInfo,
  ChatMessage,
  ChatSubExtendInfo,
  ChatSubInfo,
  UserNotice,
  regexp,
  fs,
  RefreshingAuthProvider,
  logChatMessage,
  path,
  processChatMessage,
  userId,
  ApiClient
};
