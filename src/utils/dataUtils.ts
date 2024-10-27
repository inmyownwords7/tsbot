import fs from "fs/promises";
import path from "path";

// File path for storing all users' data
const filePath = path.join('./data', 'userDataMap.json');

// Utility to save user data incrementally to a single JSON file
async function saveChatMessageData(userData: UserData): Promise<void> {
 
  if (!userData.userId) {
    throw new Error("User ID is undefined. Cannot save user data.");
  }

  let userDataMap: Record<string, UserData> = {};
  // Load the existing data from the file
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    userDataMap = JSON.parse(data);
  } catch (err) {
    console.log('No existing file found. Creating a new one.');
  }

  // Update or add the new user data to the map
  userDataMap[userData.userId] = userData;

  // Save the updated map back to the file
  try {
    await fs.writeFile(filePath, JSON.stringify(userDataMap, null, 2), 'utf-8');
    console.log(`User data for ${userData.userName} (ID: ${userData.userId}) saved successfully.`);
  } catch (error) {
    console.error(`Failed to save user data for ${userData.userId}:`, error);
  }
}

// Utility to load all user data from the JSON file
async function loadAllUserData(): Promise<Record<string, UserData> | null> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);  // Return the parsed user data map
  } catch (error) {
    console.error(`Error loading from ${filePath}:`, error);
    return null;
  }
}

// Utility to save JSON data to a file (generic utility if needed elsewhere)
async function saveJSONData(path: string, data: any): Promise<void> {
  try {
    await fs.writeFile(path, JSON.stringify(data, null, 4), { encoding: "utf-8" });
    console.log(`${path} saved successfully.`);
  } catch (error) {
    console.error(`Error saving to ${path}:`, error);
  }
}

// Utility to load JSON data from a file (generic utility if needed elsewhere)
async function loadJSONData(path: string): Promise<any | null> {
  try {
    const data = await fs.readFile(path, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading from ${path}:`, error);
    return null;
  }
}

// JSON replacer and reviver functions to handle Maps
function jsonReplacer(key: string, value: unknown): unknown {
  if (value instanceof Map) {
    return { dataType: "Map", value: Array.from(value.entries()) };
  }
  return value;
}

function jsonReviver(key: string, value: unknown): unknown {
  if (typeof value === "object" && value !== null && (value as any).dataType === "Map") {
    return new Map((value as any).value);
  }
  return value;
}

export {loadAllUserData, loadJSONData, saveChatMessageData, saveJSONData, jsonReplacer, jsonReviver}