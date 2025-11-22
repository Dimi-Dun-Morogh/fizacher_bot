import { Telegraf } from "telegraf";
import "dotenv/config";
import { fizCmdHandler } from "./handlers.js";


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))

bot.command('oldschool', (ctx) => ctx.reply('Hello'))
bot.command('hipster', Telegraf.reply('λ'))



bot.command('fiz', async (ctx) => {
    fizCmdHandler(ctx);

    
  
});


// bot.on('inline_query', async (ctx) => {
//     const q = ctx.inlineQuery.query.trim(); 
//     // Например: "отжимания 20"

//     if (!q) {
//         return ctx.answerInlineQuery([], { cache_time: 0 });
//     }

//     const parts = q.split(' ');
//     const last = parts[parts.length - 1];

//     const count = parseInt(last, 10);

//     if (isNaN(count)) {
//         // Если пользователь ещё не ввёл количество
//         return ctx.answerInlineQuery([
//             {
//                 type: 'article',
//                 id: 'no-count',
//                 title: 'Укажи количество повторений',
//                 description: 'Пример: отжимания 20',
//                 input_message_content: {
//                     message_text: 'Напиши: упражнение количество\nПример: отжимания 20'
//                 }
//             }
//         ], { cache_time: 0 });
//     }

//     const exercise = parts.slice(0, -1).join(' ');

//     return ctx.answerInlineQuery([
//         {
//             type: 'article',
//             id: 'exercise',
//             title: `Записать: ${exercise} — ${count}`,
//             description: 'Добавить упражнение?',
//             input_message_content: {
//                 message_text: `Добавлено: ${exercise} — ${count} повторений`
//             },
//             reply_markup: {
//                 inline_keyboard: [
//                     [
//                         {
//                             text: 'Добавить в статистику',
//                             callback_data: JSON.stringify({
//                                 exercise,
//                                 count
//                             })
//                         }
//                     ]
//                 ]
//             }
//         }
//     ], { cache_time: 0 });
// });

export default bot;
