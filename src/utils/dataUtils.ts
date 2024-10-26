import fs from "fs/promises";
import path from "path";

// Utility to save JSON data to a file
export async function saveJSONData(path: string, data: any): Promise<void> {
  try {
    await fs.writeFile(path, JSON.stringify(data, null, 4), { encoding: "utf-8" });
    console.log(`${path} saved successfully.`);
  } catch (error) {
    console.error(`Error saving to ${path}:`, error);
  }
}

// Utility to load JSON data from a file
export async function loadJSONData(path: string): Promise<any | null> {
  try {
    const data = await fs.readFile(path, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading from ${path}:`, error);
    return null;
  }
}

// JSON replacer and reviver functions to handle Maps
export function jsonReplacer(key: string, value: unknown): unknown {
  if (value instanceof Map) {
    return { dataType: "Map", value: Array.from(value.entries()) };
  }
  return value;
}

export function jsonReviver(key: string, value: unknown): unknown {
  if (typeof value === "object" && value !== null && (value as any).dataType === "Map") {
    return new Map((value as any).value);
  }
  return value;
}
