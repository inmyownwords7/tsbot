// authProviderSetup.ts
import { RefreshingAuthProvider } from '@twurple/auth';
import { promises as fs } from 'fs';

interface AuthConfig {
    clientId: string;
    clientSecret: string;
}

const credentials: AuthConfig = {
    clientId: 'smnmi4qw3ybcemb10k3ty22v1sak2m',
    clientSecret: 'y9ncguf22odng34thmkfjsbtcl2luc',
};

const userId: string = "132881296"
const authProvider = new RefreshingAuthProvider(credentials);
const tokenData = JSON.parse(await fs.readFile('./tokens.json', 'utf-8'));
const initializeAuthProvider = async () => {
    const tokenData = JSON.parse(await fs.readFile('./tokens.json', 'utf-8'));
    await authProvider.addUserForToken(tokenData);
};

authProvider.onRefresh(async (userId, newTokenData) => {
    await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'utf-8');
});

// Call initialization immediately
initializeAuthProvider()
    .then(() => console.log('AuthProvider initialized successfully'))
    .catch(err => console.error('An error occurred during initialization:', err));
await authProvider.addUserForToken(tokenData);
authProvider.addIntentsToUser(userId, ['chat', 'api'])
export { authProvider };
