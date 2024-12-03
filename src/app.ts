import 'tsconfig-paths/register.js';
import 'dotenv-vault/config';
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv"
import { bot } from "./bot.js"
import path from "path";

path.dirname("/")
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
});
console.log(process.env)

const app = express();
const port: number = Number(process.env.PORT) || 29801;

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
