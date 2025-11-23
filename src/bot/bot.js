import { Telegraf } from "telegraf";
import "dotenv/config";
import { fizCmdHandler,fizMyStatCmdHandler, fizChatStatCmdHandler, helpHandler } from "./handlers.js";

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply("Welcome"));



bot.command("fiz", (ctx) => fizCmdHandler(ctx));

bot.command("fizmystat", (ctx) => fizMyStatCmdHandler(ctx));

bot.command("help", (ctx) => helpHandler(ctx));

bot.command("fizstatchat", (ctx) => fizChatStatCmdHandler(ctx));


export default bot;
