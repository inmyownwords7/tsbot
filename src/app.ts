import express from 'express';
import { bot } from './bot.js';
//**@app declaration */
const app =  express();
async function main() {
    await bot();
    // app.listen(3000, () => console.log('Server is running on port 3000'));
}
main();