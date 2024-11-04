// // Example function to simulate receiving a channel.ban event
// import {eventSubListener} from "./auth.js"

// const simulateBanEvent = () => {
//     const fakeBanEvent = {
//       subscription: {
//         id: "c7a2b714-a1e5-b741-4d5d-f861aaf57334",
//         status: "enabled",
//         type: "channel.ban",
//         version: "1",
//         condition: {
//           broadcaster_user_id: "3445772"
//         },
//         transport: {
//           method: "websocket",
//           session_id: "WebSocket-Server-Will-Set"
//         },
//         created_at: "2024-11-03T19:35:59.5528829Z",
//         cost: 0
//       },
//       event: {
//         banned_at: "2024-11-03T19:35:59.5528829Z",
//         broadcaster_user_id: "3445772",
//         broadcaster_user_login: "testBroadcaster",
//         broadcaster_user_name: "testBroadcaster",
//         ends_at: null,
//         is_permanent: true,
//         moderator_user_id: "81145616",
//         moderator_user_login: "CLIModerator",
//         moderator_user_name: "CLIModerator",
//         reason: "This is a test event",
//         user_id: "91854014",
//         user_login: "testFromUser",
//         user_name: "testFromUser"
//       }
//     };
  
//     // Call your event handler with this fake event
//     eventSubListener.emit('channel.ban', fakeBanEvent.event);
//   };
  
//   simulateBanEvent();
  