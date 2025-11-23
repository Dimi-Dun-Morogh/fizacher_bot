import { Telegraf } from "telegraf";
import "dotenv/config";
import { fizCmdHandler,fizMyStatCmdHandler, fizChatStatCmdHandler, helpHandler } from "./handlers.js";

// Проверяем аргументы
const isDev = process.argv.includes("-dev");

// Выбираем токен
const token = isDev ? process.env.DEV_BOT_TOKEN : process.env.BOT_TOKEN;

const bot = new Telegraf(token);
bot.start((ctx) => ctx.reply("Welcome"));



bot.command("fiz", (ctx) => fizCmdHandler(ctx));

bot.command("fizmystat", (ctx) => fizMyStatCmdHandler(ctx));

bot.command("help", (ctx) => helpHandler(ctx));

bot.command("fizstatchat", (ctx) => fizChatStatCmdHandler(ctx));


export default bot;
