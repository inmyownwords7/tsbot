// import { bot, chatClient, join } from './bot';
// import { loadChatUserData } from '../utils/async-config';
// import registerChatClientEvents from '../events/events';
//
// jest.mock('../utils/async-config.js', () => ({
//     loadChatUserData: jest.fn(),
// }));
// jest.mock('../events/events.js', () => jest.fn());
//
// describe('bot()', () => {
//     it('should initialize and connect the chat client', async () => {
//         const connectMock = jest.spyOn(chatClient, 'connect').mockResolvedValue(undefined);
//
//         await bot();
//
//         expect(loadChatUserData).toHaveBeenCalled();
//         expect(registerChatClientEvents).toHaveBeenCalledWith(chatClient);
//         expect(connectMock).toHaveBeenCalled();
//
//         connectMock.mockRestore();
//     });
//
//     it('should log an error if connection fails', async () => {
//         jest.spyOn(chatClient, 'connect').mockRejectedValue(new Error('Connection failed'));
//         const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
//
//         await bot();
//
//         expect(consoleErrorMock).toHaveBeenCalledWith(
//             'Failed to connect to Twitch chat:',
//             expect.any(Error)
//         );
//
//         consoleErrorMock.mockRestore();
//     });
// });
//
// describe('join()', () => {
//     it('should register the onJoin event handler', async () => {
//         const onJoinMock = jest.spyOn(chatClient, 'onJoin');
//         await join('test_channel');
//         expect(onJoinMock).toHaveBeenCalled();
//     });
// });
