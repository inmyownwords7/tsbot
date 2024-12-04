// import { bot, chatClient } from '../../src/bot/bot';
//
// describe('bot integration', () => {
//     it('should initialize and connect the chat client', async () => {
//         jest.spyOn(chatClient, 'connect').mockResolvedValue(undefined);
//         await expect(bot()).resolves.not.toThrow();
//     });
//
//     it('should register and handle events', () => {
//         chatClient.onMessage('test_channel', 'test_user', '!ping', {});
//         expect(chatClient.say).toHaveBeenCalledWith('test_channel', 'Pong!');
//     });
// });
