import chalk, { ChalkInstance } from "chalk";
// Use Record<string, ChalkInstance> for a more concise type definition
//** @Record is a TypeScript utility type that defines a static object with fixed string or number keys and values. It is more about type checking than runtime behavior.
function getRGB(r: number, g: number, b: number): ChalkInstance {
  return chalk.rgb(r, g, b);
}

export const colors: Record<string, ChalkInstance> = {
  tfblade: chalk.green,
  iwdominate: chalk.blue,
  akanemko: chalk.red,
  perkz_lol: chalk.yellow,
  moderator: chalk.greenBright,
  deputy: chalk.yellowBright,
  admin: chalk.redBright,
  broadcaster: chalk.blueBright,
  defaultColor: chalk.cyan,
  staff: chalk.magenta,
  self: getRGB(55, 90, 55),
};

export const permissions: Record<string, ChalkInstance> = {
  moderator: chalk.greenBright,
  deputy: chalk.yellowBright,
  admin: chalk.redBright,
  owner: chalk.whiteBright,
  defaultColor: chalk.cyan,
};
// export function defaultColor(arg0: string): any {
//   throw new Error("Function not implemented.");
// }

