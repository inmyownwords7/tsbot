import moment from "moment";
import path from "path"
const CHANNEL_DATA: string = "./channelsData.json";

const MESSAGES: string = path.resolve(process.cwd(), "/home/words/tsbot/src/formatting/messages.json")
const ERROR_MESSAGES: {userNotFound: string, invalidCredentials: string} = {
    userNotFound: 'User not found',
    invalidCredentials: 'Invalid username or password',
};

const SUCCESS_MESSAGES: {loginSuccess: string, registrationComplete: string} = {
    loginSuccess: 'Login successful',
    registrationComplete: 'Registration completed',
};

const botId: string = "132881296"
const DATE_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';
const getDynamicDate = (): string => moment().format(DATE_FORMAT)
// Capture the app's starting time
const STARTING_TIME: Date = new Date();
// Function to format the starting time
const getTimeFormat = (): string => moment(STARTING_TIME).format('h:mm:ss a');
// Formatted starting time string
const formattedStartTime: string = moment(STARTING_TIME).format('h:mm:ss a')
// Function to get the current time
const TIME_FORMAT = (): string => moment().format('h:mm:ss a');

export {DATE_FORMAT, CHANNEL_DATA, ERROR_MESSAGES, SUCCESS_MESSAGES, botId, TIME_FORMAT, STARTING_TIME, formattedStartTime, getDynamicDate, getTimeFormat, MESSAGES};