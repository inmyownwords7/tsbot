// Import necessary modules
import { HelixUser, UserNameResolvable } from '@twurple/api';
import { api } from '../modules/auth.js'; // Adjust based on your project
import { ACTIVEUSERGROUPSIDS as activeUserGroupsIds } from '../formatting/constants.js';
// Import activeUserGroupsIds from its source
 /**
  * Description placeholder
  * @date 1:08:12 pm
  *
  * @type {string[]}
  */
//  let activeUserGroupsIds: string[] = ["439212677", "132881296", "65538724"];
/**
 * Retrieves the user ID from the given username using HelixUserApi#getUserByName.
 * @param {string} userName - The username to extract the ID from.
 * @returns {Promise<string | false | undefined>} - Returns the user ID or false if not found.
 */
async function getUserIdFromUsername(
    userName: string
): Promise<HelixUser | null> {
    const sanitizedUserName = userName.replace("@", "").trim();

    if (!sanitizedUserName) {
        return null;
    }

    try {
        if (!api) {
            throw new Error("API instance is not available.");
        }

        const userResult = await api.users.getUserByName(
            sanitizedUserName as UserNameResolvable
        );

        return userResult || null; // Return HelixUser or null
    } catch (error) {
        console.error(`Error fetching user data for username "${userName}":`, error);
        return null;
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
    userNames = userNames.map(user => user.replace("@", ""));
  
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
        return usersResult.map(user => user.id);
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
): Promise<HelixUser | null> {
    try {
        if (!userId) {
            return null; // Return null if the user ID is not provided
        }

        if (!api) {
            throw new Error("API instance is not available.");
        }

        const userResult = await api.users.getUserById(userId);

        return userResult || null; // Return HelixUser or null
    } catch (error) {
        console.error(error);
        return null; // Return null in case of an error
    }
}

   /**
    * Description placeholder
    * @date 1:08:12 pm
    *
    * @async
    * @param {string[]} userIds
    * @returns {Promise<string[] | false>}
    */
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
        return usersResult.map(user => user.name);
      } else {
        return false; // Return undefined if the API instance is not available
      }
    } catch (error) {
      console.error(error);
      return false; // Return undefined in case of an error
    }
  }

 /**
  * Description placeholder
  * @date 1:08:12 pm
  *
  * @async
  * @param {(string | string[])} userId
  * @returns {Promise<string | string[] | false>}
  */
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

/**
 * Description placeholder
 * @date 1:08:12 pm
 *
 * @async
 * @param {string[]} userGroup
 * @returns {Promise<string[] | string | false>}
 */
async function processUserGroup(userGroup: string[]): Promise<string[] | string | false> {
    const resolvedUserIds = await resolveUserIds(userGroup);
    if (resolvedUserIds !== false && resolvedUserIds.length > 0) {
      console.log('Processing user group with IDs:', resolvedUserIds);
      // Handle further group-based processing...
    } else {
      console.log('No valid user IDs found or an error occurred.');
    }
    return resolvedUserIds !== false ? resolvedUserIds : false;
  }

  /**
   * Description placeholder
   * @date 1:08:11 pm
   *
   * @async
   * @param {string} command
   * @param {(string | string[])} user
   * @returns {*}
   */
  async function handleUserCommand(command: string, user: string | string[]): Promise<void> {
    const resolvedUserIds = await resolveUserIds(user);
  
    if (resolvedUserIds === false) {
      console.log('Could not resolve user IDs.');
    } else {
      console.log('Resolved user IDs for command:', command, resolvedUserIds);
      // Execute command with the resolved user IDs
    }
  }
  
  export {activeUserGroupsIds, handleUserCommand, getUserIdFromUsername, getUserIdsFromUsernames, getUserNameFromUserId, getUserNamesFromUserIds, processUserGroup, resolveUserIds}