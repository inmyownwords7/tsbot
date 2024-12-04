// import registerChatClientEvents from './events';
//
// describe('registerChatClientEvents()', () => {
//     const mockChatClient = {
//         onMessage: jest.fn(),
//         say: jest.fn(),
//     };
//
//     it('should register the onMessage event handler', () => {
//         registerChatClientEvents(mockChatClient as any);
//
//         expect(mockChatClient.onMessage).toHaveBeenCalled();
//     });
//
//     it('should respond with "Pong!" to "!ping"', () => {
//         const messageHandler = mockChatClient.onMessage.mock.calls[0][0];
//         messageHandler('test_channel', 'test_user', '!ping', {});
//
//         expect(mockChatClient.say).toHaveBeenCalledWith('test_channel', 'Pong!');
//     });
// });
