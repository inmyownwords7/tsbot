import chalk, { ChalkInstance } from "chalk";
// Use Record<string, ChalkInstance> for a more concise type definition
//** @Record is a TypeScript utility type that defines a static object with fixed string or number keys and values. It is more about type checking than runtime behavior.
function getRGB(r: number, g: number, b: number): ChalkInstance {
  return chalk.rgb(r, g, b);
}

const colorMap: Record<LogColor, ChalkInstance> = {
  red: chalk.red,
  blue: chalk.blue,
  green: chalk.green,
  yellow: chalk.yellow,
  magenta: chalk.magenta,
  cyan: chalk.cyan,
};

const colors: Record<string, ChalkInstance> = {
  tfblade: chalk.green,
  iwdominate: chalk.blue,
  akanemko: chalk.red,
  perkz_lol: chalk.yellow,
  moderator: chalk.greenBright,
  deputy: chalk.yellowBright,
  subscriber: chalk.redBright,
  vip: chalk.blueBright,
  defaultColor: chalk.cyan,
  staff: chalk.magenta,
  self: getRGB(55, 90, 55),
};


const permissions: Record<string, ChalkInstance> = {
  moderator: chalk.greenBright,
  deputy: chalk.yellowBright,
  admin: chalk.redBright,
  owner: chalk.whiteBright,
  defaultColor: chalk.cyan,
};

// Function to get Chalk instance from logColor string
function getColor(logColor: string): ChalkInstance {
  return colorMap[logColor as LogColor] || chalk.cyan; // Default to cyan if logColor is invalid
}

export {colors, getColor, permissions}