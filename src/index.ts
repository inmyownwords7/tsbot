// /// <reference path="./types/types.d.ts" />
// /**
//  * TODO setup bot token. Use environment variables. Apply processCommandOrMessages
//  * Must also implement a count system for the groups.
//  * Add an option to specify the groups in the bot config.
//  * @constants is located in a separate file. constants.ts
//  */
// import * as fs from "fs";
// import * as path from "path";

// import regexp from "xregexp";
// import { RefreshingAuthProvider } from "@twurple/auth";
// import { ApiClient } from "@twurple/api";
// import {
//   ChatClient,
//   ChatMessage,
//   UserNotice,
// } from "@twurple/chat";
// import * as authProvider from "./modules/auth.js";
// import * as channelsMap from "./utils/async config.js";
// import * as colors from "./formatting/chalk.js";
// import { DATE_FORMAT } from "./formatting/constants.js";
// import * as logger from "./modules/logger.js";

// import { logHttpRequest } from "./modules/logger.js";

// export {
//   authProvider,
//   channelsMap,
//   colors,
//   DATE_FORMAT,
//   logger,
//   ChatClient,
//   ChatMessage,
//   UserNotice,
//   regexp,
//   fs,
//   RefreshingAuthProvider,
//   logHttpRequest,
//   path,
//   // processChatMessage,
//   ApiClient,
// };
