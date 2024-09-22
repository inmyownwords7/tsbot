import moment from "moment";

const DATE_FORMAT: string = moment().format('YYYY-MM-DD HH:mm:ss');
 const CHANNEL_DATA: string = "./channelsData.json";

const ERROR_MESSAGES: {userNotFound: string, invalidCredentials: string} = {
    userNotFound: 'User not found',
    invalidCredentials: 'Invalid username or password',
};

const SUCCESS_MESSAGES: {loginSuccess: string, registrationComplete: string} = {
    loginSuccess: 'Login successful',
    registrationComplete: 'Registration completed',
};

export {DATE_FORMAT, CHANNEL_DATA, ERROR_MESSAGES, SUCCESS_MESSAGES};