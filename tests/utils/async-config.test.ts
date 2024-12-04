import { loadChatUserData, saveChatMessageData } from './async-config';

describe('loadChatUserData()', () => {
    it('should load chat user data without errors', async () => {
        await expect(loadChatUserData()).resolves.not.toThrow();
    });
});

describe('saveChatMessageData()', () => {
    it('should save a chat message', async () => {
        console.log = jest.fn();
        await saveChatMessageData('test_channel', 'test_user', 'Hello!');
        expect(console.log).toHaveBeenCalledWith(
            'Saving message from test_user in test_channel: Hello!'
        );
    });
});
