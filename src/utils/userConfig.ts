import { ChatUser } from "@twurple/chat";
const User: ChatUser = new ChatUser();
const userObject = {
  username: User.userName,
  userId: User.userId,
  type: User.userType,
  isVip: User.isVip,
  isModerator: User.isMod,
  isSubscriber: User.isSubscriber,
  badges: User.badges,
  color: User.color,
  streamer: User.isBroadcaster,
  founder: User.isFounder
};

export {userObject}
