// import 'module-alias/register.js';
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import {bot} from "./bot.js"
import { logHttpMessage } from "./modules/logger.js";

dotenv.config();
const app = express();
const port: number = Number(process.env.PORT) || 29800;

app.use(
  morgan("combined", {
    stream: { write: (message: string) => logHttpMessage(message.trim()) },
  })
);

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

main();
