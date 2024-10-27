// Import necessary modules
import { api } from "../modules/auth.js"; // Adjust based on your project
import { activeUserGroupsIds, activeUserGroups } from "formatting/constants.js";
/**
 * Retrieves the user ID from the given username using HelixUserApi#getUserByName.
 * @param {string} userName - The username to extract the ID from.
 * @returns {Promise<string | false | undefined>} - Returns the user ID or false if not found.
 */
async function getUserIdFromUsername(
  userName: string
): Promise<string | false | undefined> {
  userName = userName.replace("@", ""); // Remove '@' if present

  try {
    if (!userName) {
      return false; // If username is empty or invalid
    } else if (userName && api) {
      // Use HelixUserApi to fetch the user data for the given username
      const userResult = await api.users.getUserByName(userName);

      if (!userResult) {
        return false; // Return false if the user was not found
      } else {
        // Return the user ID from the HelixUser object
        return userResult.id; // No array access, directly access the 'id' property
      }
    }
  } catch (error) {
    console.error(error);
    return undefined; // Return undefined in case of an error
  }
}

/**
 * Retrieves user IDs for an array of usernames using HelixUserApi#getUsersByNames.
 * @param {string[]} userNames - The list of usernames to extract IDs from.
 * @returns {Promise<string[] | false >} - Returns an array of user IDs or false if none found.
 */
async function getUserIdsFromUsernames(
  userNames: string[]
): Promise<string[] | false | undefined> {
  // Remove any '@' from usernames
  userNames = userNames.map((user) => user.replace("@", ""));

  try {
    if (!userNames || userNames.length === 0) {
      return false; // Return false if no usernames provided
    }

    if (api) {
      // Fetch the user data for the given list of usernames
      const usersResult = await api.users.getUsersByNames(userNames);

      if (!usersResult || usersResult.length === 0) {
        return false; // Return false if no users were found
      }

      // Extract and return the IDs from the fetched user data
      return usersResult.map((user) => user.id);
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false; // Return false if an error occurs
  }
}

/**
 * Resolves user IDs from a given string or array of strings using HelixUserApi.
 * @param {(string | string[])} userId - The user ID or an array of user IDs.
 * @returns {Promise<string | string[] | false>} - Returns resolved user IDs or false if not found.
 */

async function getUserNameFromUserId(
  userId: string
): Promise<string | false | undefined> {
  try {
    if (!userId) {
      return false; // Return false if the user ID is not provided
    }

    if (api) {
      // Fetch the user data for the given user ID
      const userResult = await api.users.getUserById(userId);

      if (!userResult) {
        return false; // Return false if the user was not found
      }

      // Return the username from the fetched user object
      return userResult.name;
    } else {
      return undefined; // Return undefined if the API instance is not available
    }
  } catch (error) {
    console.error(error);
    return undefined; // Return undefined in case of an error
  }
}

async function getUserNamesFromUserIds(
  userIds: string[]
): Promise<string[] | false> {
  try {
    if (!userIds || userIds.length === 0) {
      return false; // Return false if no user IDs are provided
    }

    if (api) {
      // Fetch the user data for the given list of user IDs
      const usersResult = await api.users.getUsersByIds(userIds);

      if (!usersResult || usersResult.length === 0) {
        return false; // Return false if no users were found
      }

      // Extract and return the usernames from the fetched user data
      return usersResult.map((user) => user.name);
    } else {
      return false; // Return undefined if the API instance is not available
    }
  } catch (error) {
    console.error(error);
    return false; // Return undefined in case of an error
  }
}

async function resolveUserIds(
  userId: string | string[]
): Promise<string | string[] | false> {
  try {
    if (Array.isArray(userId)) {
      // Handle case where userId is an array of strings (user IDs)
      const results = await Promise.all(
        userId.map(async (u) => {
          u = u.replace("@", ""); // Remove '@' if present
          if (activeUserGroupsIds.includes(u)) {
            return u; // Return the ID if it's already active
          }

          if (!u || !api) {
            return false; // Return false if no user or API is available
          }

          // Fetch the user object using HelixUserApi#getUserById
          const userResult = await api.users.getUserById(u);
          return userResult ? userResult.id : false; // Return user ID or false if not found
        })
      );

      // Filter out any 'false' values from the results
      return results.filter((result) => result !== false) as string[];
    } else {
      // Handle case where userId is a single string (user ID)
      userId = userId.replace("@", ""); // Remove '@' if present

      if (activeUserGroupsIds.includes(userId)) {
        return userId; // Return the ID if it's already active
      }

      if (!userId || !api) {
        return false; // Return false if no user or API is available
      }

      // Fetch the user object using HelixUserApi#getUserById
      const userResult = await api.users.getUserById(userId);
      return userResult ? userResult.id : false; // Return user ID or false if not found
    }
  } catch (error) {
    console.error(error);
    return false; // Return false if an error occurs
  }
}

async function processUserGroup(
  userGroup: string[]
): Promise<string[] | string | false> {
  const resolvedUserIds = await resolveUserIds(userGroup);
  if (resolvedUserIds !== false && resolvedUserIds.length > 0) {
    console.log("Processing user group with IDs:", resolvedUserIds);
    // Handle further group-based processing...
  } else {
    console.log("No valid user IDs found or an error occurred.");
  }
  return resolvedUserIds !== false ? resolvedUserIds : false;
}

async (params:type) => {
  
}
async function handleUserCommand(command: string, user: string | string[]) {
  const resolvedUserIds = await resolveUserIds(user);
  command.startsWith("!");
  if (resolvedUserIds === false) {
    console.log("Could not resolve user IDs.");
  } else {
    console.log("Resolved user IDs for command:", command, resolvedUserIds);
    // Execute command with the resolved user IDs
  }
}

export {
  handleUserCommand,
  getUserIdFromUsername,
  getUserIdsFromUsernames,
  getUserNameFromUserId,
  getUserNamesFromUserIds,
  processUserGroup,
  resolveUserIds,
};
