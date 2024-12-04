import 'tsconfig-paths/register.js';
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv"
import { bot } from "./bot.js"
import fs from "fs"

const environment = process.env.NODE_ENV;
const envFilePath = process.cwd() + `/.env.${environment}`;
console.log(envFilePath)
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath, encoding: 'utf-8', debug: true });
  console.log(`Environment file loaded: ${envFilePath}`);
} else {
  dotenv.config(); // Load default .env file
  console.warn(`Environment file not found for ${environment}, loaded default .env`);
}

console.log("This is they key "+process.env.NODE_ENV)
// console.log(process.env.NODE_ENV)

const app = express();
const port: number = Number(process.env.PORT) || 29800;

// app.use(
//   morgan("combined", {
//     stream: { write: (message: string) => logHttpRequest(message.trim()) },
//   })
// );

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export async function main() {
  await bot();
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log("Shutting down gracefully...");
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  });
}

await main().catch(console.error);
