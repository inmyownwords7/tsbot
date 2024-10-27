import moment from "moment";
import path from "path";

const CHANNEL_DATA_PATH: string = "./channelsData.json";
const CHATUSER_PATH: string = "./users.json";
const MESSAGES: string = path.resolve(
  process.cwd(),
  "/home/words/tsbot/src/formatting/messages.json"
);
const EVENT_PATH: string = path.resolve(
  process.cwd(),
  "/home/words/tsbot/src/formatting/EVENTS.json"
);

const ERROR_MESSAGES: { userNotFound: string; invalidCredentials: string } = {
  userNotFound: "User not found",
  invalidCredentials: "Invalid username or password",
};

const SUCCESS_MESSAGES: { loginSuccess: string; registrationComplete: string } =
  {
    loginSuccess: "Login successful",
    registrationComplete: "Registration completed",
  };
const activeUserGroups: string[] = ["woooordbot"];
/**
 * @returns {string[]
 *}
 * @type {string[]}
 */
const activeUserGroupsIds: string[] = ["439212677", "132881296", "65538724"];
const botId: string = "132881296";
const DATE_FORMAT: string = "YYYY-MM-DD HH:mm:ss";
const GETDYNAMICDATE = (): string => moment().format(DATE_FORMAT);
// Capture the app's starting time
const STARTING_TIME: Date = new Date();
// Function to format the starting time
const GETTIMEFORMAT = (): string => moment(STARTING_TIME).format("h:mm:ss a");

// Formatted starting time string
const FORMATTEDSTARTTIME: string = moment(STARTING_TIME).format("h:mm:ss a");
// Function to get the current time
const TIME_FORMAT = (): string => moment().format("h:mm:ss a");

export {
  DATE_FORMAT,
  CHANNEL_DATA_PATH,
  CHATUSER_PATH,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  botId,
  TIME_FORMAT,
  STARTING_TIME,
  FORMATTEDSTARTTIME,
  GETDYNAMICDATE,
  GETTIMEFORMAT,
  MESSAGES,
  EVENT_PATH,
  activeUserGroups,
  activeUserGroupsIds,
};
