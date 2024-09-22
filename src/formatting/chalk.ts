import chalk, { ChalkInstance } from "chalk";

// Use Record<string, ChalkInstance> for a more concise type definition
//** @Record is a TypeScript utility type that defines a static object with fixed string or number keys and values. It is more about type checking than runtime behavior.
export const colors: Record<string, ChalkInstance> = {
    tfblade: chalk.green,
    iwdominate: chalk.blue,
    akanemko: chalk.red,
    perkz_lol: chalk.yellow,
    magenta: chalk.magenta,
    cyan: chalk.cyan,
    white: chalk.white,
    gray: chalk.gray,
    defaultColor: chalk.cyan,
};
