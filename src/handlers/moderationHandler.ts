/* eslint-disable @typescript-eslint/no-unused-vars */
//* Command handler codes are written here and then exported into app.js
//* IMPORTS ONLY
//* ONGOING COMMANDS HERE MUST BE ASYNCS COMPARED TO THE OTHER ONE WHICH IS SYNC
import { chatClient } from '../bot.js';

import { logChannelMessage } from '../modules/logger.js';
import { colors } from '../formatting/chalk.js';
import { GroupArray, globalMod, GroupArrayIds } from './Groups.js';
import { botId, CHANNEL_DATA_PATH } from '../formatting/constants.js';

//* EXPORTS ONLY
// let toggleLog = true
// let syslogs = logger;
// --------------------------------------
//
// command handler funcs
//
// -------------------------------------------------
export function toggleHandler(channel: any, user: any, text: any, msg: any, messageMetaData: { isStaff: any; }) {
  if (isCommand('!disabletoggle', text) && messageMetaData.isStaff) {
    console.log(colors.system('autoMessage has been turned off. '));
    //  toggleLog = false
  } else if (isCommand('!enabletoggle', text) && messageMetaData.isStaff) {
    console.log(colors.system('autoMessage has been turned on. '));
    // toggleLog = true
    // channelsMap.get(channel).isForeignEnabled = true,
    // channelsMap.get(channel).isFlamingEnabled = true
  }
}

async function toggleLanguage(channel: any, user: any, text: any, msg: any, messageMetaData: { isStaff: any; }) {
  if (isCommand('!disableforeign', text) && messageMetaData.isStaff) {
    channelsMap.get(channel).isForeignEnabled = false;
    console.log(channelsMap.get(channel).isForeignEnabled);
  } else if (isCommand('!enableforeign', text) && messageMetaData.isStaff) {
    channelsMap.get(channel).isForeignEnabled = true;
    console.log(channelsMap.get(channel).isForeignEnabled);
  }
}

async function toggleKorean(channel: any, user: any, text: any, msg: any, messageMetaData: { isStaff: any; }) {
  if (isCommand('!disablekr', text) && messageMetaData.isStaff) {
    channelsMap.get(channel).isKoreanEnabled = false;
    console.log(channelsMap.get(channel).isKoreanEnabled);
  } else if (isCommand('!enablekr', text) && messageMetaData.isStaff) {
    channelsMap.get(channel).isKoreanEnabled = true;
    console.log(channelsMap.get(channel).isKoreanEnabled);
  }
}

export async function flameToggler(channel: string, user: any, text: any, msg: any, messageMetaData: { isStaff: any; }) {
  channel = channel.replace('#', '');

  let flameToggle = isCommand('!enableflame', text);
  if (flameToggle && messageMetaData.isStaff) {
    channelsMap.get(channel).isFlamingEnabled = true;
    chatClient.say(channel, "PREPARING PURGE MODE (I'M A BOT) MrDestructoid");
    console.log('enable flame typed');
  }

  flameToggle = isCommand('!disableflame', text);
  if (flameToggle && messageMetaData.isStaff) {
    channelsMap.get(channel).isFlamingEnabled = false;
    chatClient.say(channel, "DISABLING PURGE MODE (I'M A BOT) MrDestructoid");
    console.log('disable flame typed');
  }
}

export async function toggleTempoHandler(
  channel: string,
  user: any,
  text: any,
  msg: any,
  messageMetaData: { isStaff: any; },
) {
  channel = channel.replace('#', '');

  let tempoToggle = isCommand('!enabletempo', text);
  if (tempoToggle && messageMetaData.isStaff) {
    channelsMap.get(channel).toggleTempo = true;
    // chatClient.say(channel, `PREPARING PURGE MODE (I'M A BOT) MrDestructoid`)
    console.log('enable flame typed');
  }

  tempoToggle = isCommand('!disabletempo', text);
  if (tempoToggle && messageMetaData.isStaff) {
    channelsMap.get(channel).toggleTempo = false;
    // chatClient.say(channel, `DISABLING PURGE MODE (I'M A BOT) MrDestructoid`)
    console.log('enable temp typed');
  }
}

export async function toggleSubscriptionHandler(
  channel: any,
  user: any,
  text: string,
  msg: any,
  messageMetaData: { isPermitted: any; isStaff: any; },
) {
  if (text === '!disableNotifications' && messageMetaData.isPermitted) {
    // TODO document why this block is empty
  } else if (text === '!enableNotifications' && messageMetaData.isStaff) {
    // TODO document why this block is empty
  }
}

export async function timeoutHandler(
  channel: string,
  user: any,
  text: any,
  msg: { userInfo: { userId: any; }; },
  messageMetaData: { isStaff: any; isParty: any; isDeputy: any; },
) {
  const isTimeoutCommand = isCommand('!timeout', text);
  try {
    if (isTimeoutCommand) {
      if (
        messageMetaData.isStaff ||
        messageMetaData.isParty ||
        messageMetaData.isDeputy
      ) {
        // const channelId = msg.channelId
        const args = isTimeoutCommand;
        // console.log('these are the arguments of ' + args[0])

        // syslogs.info(colors.command(`${channel}: ${user}: ${text}`))
        // args[0].replace('/@/g', '')
        // console.log(channelId + ' ' + args[0])

        // console.log('timeout args: ', args[0], args[1], args[2], args[3])

        const reason = args.slice(3, args.length).join(' ');
        //! timeout [channel] [user] [duration] [reason]
        console.log(
          'Checking for possible error by checking values of:' + reason,
        );

        args[0].replace('/@/g', '');
        if (
          !GroupArray.includes(args[0].toLowerCase()) ||
          !GroupArrayIds.includes(msg.userInfo.userId)
        ) {
          if (args.length === 1) {
            loggers.logger.info(
              colors.cyan(
                `${user} timed out ` +
                  args[0].toLowerCase() +
                  `for 600 seconds in ${channel}`,
              ),
            );
            banUser(
              channel,
              args[0],
              600,
              'Timed out by deputy moderator.',
              msg,
            );
          } else {
            banUser(args[0], args[1], args[2], reason, msg);
          }
        } else {
          console.log(
            channel +
              `${args[0].toLowerCase()} is immune from deputy timeouts.`,
          );
          chatClient.say(
            channel,
            `${args[0].toLowerCase()} is immune from deputy timeouts.`,
          );
        }
        loggers.syslogs.info(colors.command(args[0], args[1], args[2], reason));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// eslint-disable-next-line no-unused-vars
export async function banMultipleHandler(
  channel: any,
  user: any,
  text: any,
  msg: { userInfo: { userId: any; }; },
  messageMetaData: any,
) {
  const users = isCommand('!masspurge', text);
  // step 1 collect all the users
  try {
    if (users) {
      if (globalMod.includes(msg.userInfo.userId)) {
        banMultipleUsers(channel, users, msg);
        whispers(`${user}`, `Banning these users: ${users.join(', ')}`);
      }
    }
  } catch (error) {
    whispers(
      `${user}`,
      "Something went wrong while banning users, one or more may not have been perma'ed",
    );
  }
}

export async function unbanHandler(channel: any, user: any, text: string, msg: any, messageMetaData: { isStaff: any; }) {
  if (
    text.substring(0, '!unban'.length) === '!unban' &&
    messageMetaData.isStaff
  ) {
    const args = text.split(' ');

    console.log(args[1]);

    console.log(args[2]);

    const channelId = await extractIdFromUser(args[1]);
    const userId = await extractIdFromUser(args[2]);
    loggers.syslogs.info(colors.command(`${channel}: ${user}: ${text}`));
    await moderateApi.unbanUser(channelId, botId, userId);
  }
}

export async function clipHandler(channel: string, user: any, text: string, msg: any, messageMetaData: { isStaff: any; }) {
  if (text === '!clip' && messageMetaData.isStaff) {
    const reClip = await createClip(channel, false);
    loggers.syslogs.info(colors.command(`${channel}: ${user}: ${text}`));
    // clipLog.info(`${channel}: clip ${reClip} generated by ${user}`)
    await chatClient.say(channel, `@${user} Here's your clip <3 <3 ${reClip}`);
  }
}

//! prediction title win lose duration
export async function predictionHandler(
  channel: any,
  user: any,
  text: string,
  msg: any,
  messageMetaData: { isStaff: any; },
) {
  if (
    text.substring(0, '!prediction'.length) === '!prediction' &&
    messageMetaData.isStaff
  ) {
    const channelId = await extractIdFromUser(channel);

    const args = text.split(' ');

    let lockAfter = 100;

    if (args.length > 4) {
      lockAfter = args[4];
    }

    loggers.syslogs.info(colors.command(`${channel}: ${user}: ${text}`));
    predictionApi.createPrediction(channelId, {
      autoLockAfter: lockAfter,
      outcomes: [args[2], args[3]],
      title: args[1],
    });
  }
}

export async function CaptureTextHandler(
  channel: string,
  user: any,
  text: string,
  msg: any,
  messageMetaData: { isStaff: any; },
) {
  if (
    text.substring(0, '!recordphrase '.length) === '!recordphrase ' &&
    messageMetaData.isStaff
  ) {
    const args = text.split(' ');
    // returns word after record
    const bannedPhrase = args.slice(1, args.length).join(' ');
    banQueue.get(channel).set(bannedPhrase, []); // new filter being recorded now
    loggers.syslogs.info(
      colors.command(channel, 'Now recording uses of "' + bannedPhrase + '"'),
    );
    chatClient.say(channel, 'Now recording uses of "' + bannedPhrase + '"');
  }

  if (
    text.substring(0, '!amount '.length) === '!amount ' &&
    messageMetaData.isStaff
  ) {
    const args = text.split(' ');
    const bannedPhrase = args.slice(1, args.length).join(' ');
    const usersToBan = banQueue.get(channel).get(bannedPhrase);
    if (usersToBan) {
      loggers.syslogs.info(
        colors.command(channel, 'currently ' + usersToBan.length + ' victims'),
      );
      chatClient.say(channel, 'currently ' + usersToBan.length + ' victims');
    } else {
      loggers.syslogs.info(
        colors.command(
          channel,
          'Not currently recording that phrase. Use !recordphrase ' +
            bannedPhrase +
            ' to start recording.',
        ),
      );
      chatClient.say(
        channel,
        'Not currently recording that phrase. Use !recordphrase ' +
          bannedPhrase +
          ' to start recording.',
      );
    }
  }

  if (
    text.substring(0, '!clearphrase '.length) === '!clearphrase ' &&
    messageMetaData.isStaff
  ) {
    const args = text.split(' ');
    const bannedPhrase = args.slice(1, args.length).join(' ');
    banQueue.get(channel).delete(bannedPhrase); // new filter being recorded now
    loggers.syslogs.info(
      colors.command(channel, 'Successfully cleared recorded phrase.'),
    );
    chatClient.say(channel, 'Successfully cleared recorded phrase.');
  }

  if (
    text.substring(0, '!purge '.length) === '!purge ' &&
    messageMetaData.isStaff
  ) {
    const args = text.split(' ');
    const bannedPhrase = args.slice(1, args.length).join(' ');
    const usersToBan = banQueue.get(channel).get(bannedPhrase);
    if (usersToBan) {
      banMultipleUsers(
        channel,
        usersToBan,
        1,
        'I WARNED YOU FOOLS I WILL RETURN A SUPRISE!!!!!!!!!!!!!!!! timed out for typing ' +
          bannedPhrase,
        msg,
      );
      chatClient.say(channel, 'bye RIPBOZO');
    }
  }

  if (text === '!checkfilteredwords' && messageMetaData.isStaff) {
    whispers(`${user}`, ` The followings words are: [${filteredwords}]`);
  }

  // can use this to test stuff
}

export function tempoHandler(channel: string, user: any, text: string, msg: any, messageMetaData: { isStaff: any; }) {
  try {
    if (text.toLowerCase() === '!checkwords' && messageMetaData.isStaff) {
      let whisperMessage = '';
      Array.from(tempowords.keys()).forEach((channel) => {
        whisperMessage += channel + ': \n';
        whisperMessage += `${tempowords.get(channel)}`;
        whisperMessage += ' \n';
      });
      whispers(user, whisperMessage);
    }
    // add words into the tempo array though whispers or general chat.
    const messageSlicer = text.toLowerCase().slice(0, '!tempo add'.length);
    if (messageSlicer === '!tempo add' && messageMetaData.isStaff) {
      console.log('working');
      const wordToAdd = text.slice('!tempo add'.length + 1, text.length);
      if (wordToAdd) {
        loggers.syslogs.info(
          colors.command(channel, `The word ${wordToAdd} has been added.`),
        );
        chatClient.say(channel, `The word ${wordToAdd} has been added.`);
        tempowords.get(channel).push(wordToAdd);
        loggers.syslogs.info(
          colors.command(
            wordToAdd +
              ' was added into the array ' +
              ' is the new array: ' +
              tempowords.get(channel),
          ),
        );
      }
    }

    const tempoRemoveSlicer = text
      .toLowerCase()
      .slice(0, '!tempo remove'.length);

    if (tempoRemoveSlicer === '!tempo remove' && messageMetaData.isStaff) {
      const wordToRemove = text.slice('!tempo remove'.length + 1, text.length); // returns test
      const indexRemoveSlice = tempowords.get(channel).indexOf(wordToRemove); // returns the position of test in the array.
      if (indexRemoveSlice > -1) {
        tempowords.get(channel).splice(indexRemoveSlice, 1); // removes the word test from the array and returns the word.
        loggers.syslogs.info(
          colors.command(
            channel,
            `@${user} ` + `The word ${wordToRemove} has been removed.`,
          ),
        );
        chatClient.say(
          channel,
          `@${user} ` + `The word ${wordToRemove} has been removed.`,
        );

        loggers.syslogs.info(
          colors.command(
            wordToRemove +
              ' was removed from the array ' +
              'the new array is: ' +
              tempowords.get(channel),
          ),
        );
      } else {
        loggers.syslogs.info(
          colors.command(
            channel,
            `@${user} ` +
              `The word ${wordToRemove} is not being filtered, can't remove.`,
          ),
        );
        chatClient.say(
          channel,
          `@${user} ` +
            `The word ${wordToRemove} is not being filtered, can't remove.`,
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

/** @SystemCommands */
export async function systemHandler(channel: string, user: string, text: string, messageMetaData: { isStaff: any; }) {
  //! shutdown the bot completely.
  if (
    text === '!shutdown' &&
    messageMetaData.isStaff &&
    user === 'woooordbot'
  ) {
    loggers.syslogs.info(
      colors.command(`Forced Shutdown initiated in ${channel} by ${user}`),
    );
    chatClient.quit();
    //! part implies leaving a channel, parameter is !part #channel. channel === channel means it can only be used in the same channel
  } else if (text === '!part' && messageMetaData.isStaff) {
    loggers.syslogs.info(
      colors.command(`Now leaving ${channel} command by ${user}`),
    );
    chatClient.part(channel);
  } else if (text === '!join' && messageMetaData.isStaff) {
    if (
      text.substring(0, '!join '.length) === '!join ' &&
      messageMetaData.isStaff
    ) {
      const args = text.split(' ');
      channel = args.slice(1, args.length).join(' ');
      loggers.syslogs.info(colors.command(`${user} is now joining ${args[1]}`));
      chatClient.join(channel);
    }
  }
}

export async function tweetHandler(channel: string, user: any, text: any, messageMetaData: { isStaff: any; }) {
  const param = isCommand('!tweet', text);
  if (param && messageMetaData.isStaff) {
    const args = param;
    // eslint-disable-next-line no-undef
    request(
      {
        uri: `https://decapi.me/twitter/latest/${args[0]}`,
        method: 'GET',
      },
      async function (err: any, res: any, body: any) {
        if (err) {
          console.log(err);
        }
        chatClient.say(channel, `${body}`);
      },
    );
  }
}

// ----------------------------------
//
// util funcs
//
// --------------------------------------------

export async function generalCommands(
  channel: string,
  user: any,
  text: any,
  msg: any,
  messageMetaData: { isStaff: any; },
) {
  const param = isCommand('!status', text);
  // Displays whether bot is online or not.
  if (param && messageMetaData.isStaff) {
    await chatClient.say(channel, 'Wordbot is currently online MrDestructoid');
  }
  // informs of count of banned
}

export function addCommand(channel: string, user: any, text: any, msg: any, messageMetaData: { isStaff: any; }) {
  // console.log(text)
  const param = isCommand('!addorder', text);
  // console.log(param)
  if (param && messageMetaData.isStaff) {
    // if param is greater or equal to 2 such as !addcom !command content is true
    if (param.length >= 2) {
      console.log(param);
      const newCommandResponse = param.slice(1).join(' ');
      loggers.syslogs.info(
        colors.command(channel, `${param[0]} has been added. as an command`),
      );
      chatClient.say(channel, `${param[0]} has been added. as an command`);
      commands.get(channel).set(param[0], newCommandResponse);
    }
  }
}

export function delCommand(channel: string, user: any, text: any, msg: any, messageMetaData: { isStaff: any; }) {
  const param = isCommand('!delorder', text);
  // if isCommand is true
  if (param && messageMetaData.isStaff) {
    console.log(
      'result of commands.get(channel).get(param[0])',
      commands.get(channel).get(param[0]),
    );
    // if !delorder !content
    if (param.length === 1 && commands.get(channel).get(param[0])) {
      chatClient.say(channel, `${param[0]} has been deleted.`);
      commands.get(channel).delete(param[0]);
    } else {
      chatClient.say(
        channel,
        "The order you're trying to delete does not exist.",
      );
    }
  }
}

// export function editCommand(channel, user, text, msg, messageMetaData) {
//     let param = isCommand("!editorder", text)
//     if (param && messageMetaData.isStaff) {
//         if (param.length >= 2 && commands.get(channel).get(param[0])) {
//             console.log(param.length >= 2)
//             if (commands.get(channel).get(param[0])) {
//                 let newCommandResponse = param.slice(1).join(" ")
//                 commands.get(channel).set(param[0], newCommandResponse)
//             } else {
//                 chatClient.say(channel, "command does not exist")
//             }
//         }
//     }

//     let response = commands.get(channel).get(text)
//     if (response) {
//         chatClient.say(channel, response)
//     }
// }

// 0 is !addcom, 1 is !something, 2 is the rest
export const quoteObject = { addQuote, delQuote, editQuote, invokeQuote };

function addQuote(channel: string, user: any, text: any, msg: any, messageMetaData: { isStaff: any; }) {
  const param = isCommand('!addquote', text);
  // console.log(isCommand("!addquote", text))
  if (param && messageMetaData.isStaff) {
    if (param.length >= 1) {
      const quote = param.join(' ');
      quotes.get(channel).push(quote);
      chatClient.say(channel, `Quote #${quotes.get(channel).length} added.`);
    }
  }
}

function delQuote(channel: string, user: any, text: any, msg: any, messageMetaData: { isStaff: any; }) {
  const param = isCommand('!delquote', text);
  // if isCommand is true
  if (param && messageMetaData.isStaff) {
    // if !delorder !content
    if (
      param.length === 1 &&
      !isNaN(param[0]) &&
      quotes.get(channel).length > param[0]
    ) {
      // chatClient.say(channel, `${param[0]} has been deleted.`)
      let arr = quotes.get(channel);
      // arr.splice returns a copy, does not modify original array. if you want it to modify original you need to set arr = to the copy it creates
      arr = arr.splice(param[0], 1);
      // arr.indexOf(param[0]) this no just param 0. user types !delquote 1, 1 is already the index you don't need to do anything more
      quotes.set(channel, arr);
      chatClient.say(channel, 'Quote deleted.');
    } else {
      chatClient.say(
        channel,
        "The quote you're trying to delete does not exist. Please enter the index of the quote.",
      );
    }
  }
}

function editQuote(channel: string, user: any, text: any, msg: any, messageMetaData: { isStaff: any; }) {
  const param = isCommand('!editquote', text);
  if (param && messageMetaData.isStaff) {
    // quotes.get(channel).get(param[0]) it's not a map with a map, it's a map with an array
    if (
      param.length >= 2 &&
      !isNaN(param[0]) &&
      quotes.get(channel).length > param[0]
    ) {
      quotes.get(channel)[param[0]] = param.slice(1).join(' ');
      chatClient.say(channel, `Quote #${quotes.get(channel).length} edited.`);
    } else {
      chatClient.say(
        channel,
        "The quote you're trying to edit does not exist. Please enter the index of the quote.",
      );
    }
  }
}

function invokeQuote(channel: string, user: any, text: any, msg: any, messageMetaData: { isStaff: any; }) {
  const param = isCommand('!quote', text);
  if (param && messageMetaData.isStaff) {
    let index = param[0];
    // console.log(param)
    if (param[0] === '') {
      index = Math.floor(Math.random() * quotes.get(channel).length);
    }
    if (!isNaN(index) && quotes.get(channel).length > index) {
      chatClient.say(channel, `Quote #${index}: ${quotes.get(channel)[index]}`);
    } else {
      chatClient.say(channel, "That quote doesn't exist");
    }
  }
}

export { toggleKorean, toggleLanguage };