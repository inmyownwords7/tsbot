// import { getEventMessages } from "../formatting/loadJSON.js";

// // Handles the 'ban' event
// export async function handleBanEvent({
//   channel,
//   user,
//   msg,
// }: BanEvent): Promise<void> {
//   const banMessage = await getEventMessages("moderatorEvents", "ban_message", {
//     channel,
//     user,
//   });
//   console.log(banMessage);
// }

// // Handles the 'timeout' event
// export async function handleTimeoutEvent({
//   channel,
//   user,
//   duration,
//   msg,
// }: TimeoutEvent): Promise<void> {
//   const timeoutMessage = await getEventMessages(
//     "moderatorEvents",
//     "timeout_message",
//     {
//       channel,
//       user,
//       duration,
//     }
//   );
//   console.log(timeoutMessage);
// }
