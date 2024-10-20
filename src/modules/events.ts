import { ChatAnnouncementInfo, ChatMessage, ClearChat, ClearMsg, UserNotice } from '@twurple/chat';
import { ChatClient } from '@twurple/chat';
import { EventEmitter } from 'events';
import { logChannelMessage } from './logger.js';
const event = new EventEmitter();

// Handles the 'ban' event
event.on('message', async (channel: string, user: string, text: string, msg: ChatMessage) => {
    logChannelMessage(channel, user, text, msg)
// console.log(`${channel}: ${user}: ${text}`)
})

event.on('ban', async (channel: string, user: string, msg: ClearChat) => {
    console.log(`${user} is banned from ${channel}`);
  });
  
  // Handles the 'messageRemove' event
  event.on('messageRemove', async (channel: string, messageId: string, msg: ClearMsg) => {
    console.log(`Message with ID ${messageId} was removed in ${channel}`);
  });
  
  // Handles the 'timeout' event
  event.on('timeout', async (channel: string, user: string, duration: number, msg: ClearChat) => {
    console.log(`${channel}: ${user} was timed out for ${duration} seconds`);
  });
  
  // Handles the 'announcement' event
  event.on('announcement', async (channel: string, user: string, announcementInfo: ChatAnnouncementInfo, msg: UserNotice) => {
    console.log(`Announcement from ${user} in ${channel}: ${announcementInfo}`);
  });
  
  // Handles the 'action' event
  event.on('action', async (channel: string, user: string, text: string, msg: ChatMessage) => {
    console.log(`Action by ${user} in ${channel}: ${text}`);
  });

  function registerChatClientEvents(chatClient: ChatClient) {
    chatClient.onMessage((channel: string, user: string, text: string, msg: ChatMessage) => {
      event.emit('message', channel, user, text, msg);
    });

    chatClient.onBan((channel: string, user: string, msg: ClearChat) => {
      event.emit('ban', channel, user, msg);
    });
  
    chatClient.onMessageRemove((channel: string, messageId: string, msg: ClearMsg) => {
      event.emit('messageRemove', channel, messageId, msg);
    });
  
    chatClient.onTimeout((channel: string, user: string, duration: number, msg: ClearChat) => {
      event.emit('timeout', channel, user, duration, msg);
    });
  
    chatClient.onAnnouncement((channel: string, user: string, announcementInfo: ChatAnnouncementInfo, msg: UserNotice) => {
      event.emit('announcement', channel, user, announcementInfo, msg);
    });
  
    chatClient.onAction((channel: string, user: string, text: string, msg: ChatMessage) => {
      event.emit('action', channel, user, text, msg);
    });
  }
  
  export default registerChatClientEvents