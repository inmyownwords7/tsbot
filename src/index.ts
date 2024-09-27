/// <reference path="../types.d.ts" /> 
/**
 * TODO setup bot token. Use environment variables. Apply chatHandlers 
 * Must also implement a count system for the groups. 
 * Add an option to specify the groups in the bot config.
 * @constants is located in a separate file. constants.ts
 */
import * as fs from "fs";
import * as path from "path";

import regexp from 'xregexp'
import { RefreshingAuthProvider} from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import {
  ChatClient,
  ChatCommunitySubInfo,
  ChatMessage,
  ChatSubExtendInfo,
  ChatSubInfo,
  UserNotice
} from "@twurple/chat";

import * as authProvider from "./modules/auth.js";
import * as channelsMap from "./utils/async config.js";
import * as colors from "./formatting/chalk.js";
import { DATE_FORMAT, userId } from "./formatting/constants.js";
import * as logger from "./modules/logger.js";

import { chatHandler, handleMessage } from "./handlers/eventHandler.js";

import { logChatMessage } from "./modules/logger.js";

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
  ApiClient, 
  fs,
  RefreshingAuthProvider, userId, logChatMessage, path, chatHandler, handleMessage
};
