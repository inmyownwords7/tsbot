import { Logger, transports } from "winston";

/**
 * Toggles console logging for a given logger instance.
 * @param {Logger} logger - The Winston logger instance
 * @param {boolean} silent - Whether to mute (true) or unmute (false) console logging
 */
const toggleConsoleLogging = (logger: Logger, silent: boolean): void => {
  const consoleTransport = logger.transports.find(
    (transport) => transport instanceof transports.Console
  );
  
  if (consoleTransport) {
    consoleTransport.silent = silent;
    console.log(`Console logging is now ${silent ? "muted" : "unmuted"}.`);
  } else {
    console.warn("No console transport found in the logger.");
  }
};

/**
 * Handles the toggle console logging command.
 * @param {string} text - The message text
 * @param {Logger} logger - The Winston logger instance
 */
const handleToggleLoggingCommand = (text: string, logger: Logger): void => {
  if (text === "!mute") {
    toggleConsoleLogging(logger, true);
  } else if (text === "!unmute") {
    toggleConsoleLogging(logger, false);
  }
};

export {toggleConsoleLogging, handleToggleLoggingCommand}