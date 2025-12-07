import Db from "../db/index.js";
import {
  defineAlias,
  EXERCISE_DISPLAY_NAMES,
  xpRates,
  aliases
} from "../types/constants.js";
import { calculateLevel, numberToEmoji,formatTimestamp, getPlayerRank, sumOfChatExp } from "./helpers.js";

export async function fizCmdHandler(ctx) {
  const db = new Db();

  const {
    id,
    fist_name = "",
    last_name = "",
    type = "",
    title = "",
    username = "",
  } = ctx.chat;
  await db.createOrUpdateChat(id, {
    id,
    fist_name,
    last_name,
    type,
    title,
    username,
  });

  const text = ctx.message.text.trim();
  // Может быть: "/fiz отжимания 10" или "/fiz@fizachbot отжимания 10"

  // 1. Отрезаем саму команду (включая @username, если есть)
  //    Берём первое слово и смотрим его длину.
  const firstPart = text.split(" ")[0];
  // firstPart = "/fiz" или "/fiz@fizachbot"

  const argsText = text.slice(firstPart.length).trim();
  // Всё что после команды: "отжимания 10"

  if (!argsText) {
    return ctx.reply(
      "Формат: /fiz <упражнение> <кол-во>\nНапример: /fiz отжимания 20"
    );
  }

  // 2. Разбиваем аргументы
  const parts = argsText.split(" ");

  if (parts.length < 2) {
    return ctx.reply(
      "Формат: /fiz <упражнение> <кол-во>\nНапример: /fiz отжимания 20"
    );
  }

  const count = parseInt(parts[parts.length - 1], 10);

  if (isNaN(count)) {
    return ctx.reply(
      "Не понял количество повторений. Пример: /fiz отжимания 20"
    );
  }

  const exercise = parts.slice(0, -1).join(" ");

  console.log("Упражнение:", exercise, "Повторений:", count);

  const definedExercise = defineAlias(exercise);

  if (!definedExercise) {
    return ctx.reply("Неизвестное упражнение: " + exercise);
  }

  if (definedExercise) {
    const amountOfXp = xpRates[definedExercise] * count;
    // Добавляем упражнение в базу |

    const res = await db.addExercise(
      ctx.chat.id,
      {
        id: ctx.from.id,
        tg_username: ctx.from.username || "",
        tg_nickname:
          ctx.from.first_name +
          (ctx.from.last_name ? " " + ctx.from.last_name : ""),
      },
      definedExercise,
      count
    );

    if (!res) {
      return ctx.reply("Ошибка при добавлении упражнения. Попробуй ещё раз.");
    }

    const exerciseName = EXERCISE_DISPLAY_NAMES[definedExercise];

    const { level, next_level_xp,total_to_next } = calculateLevel(res.exp);
    console.log(next_level_xp, res.exp);
    const resultString = `
<blockquote><b>💪 + ${count} ${exerciseName} добавлено!</b></blockquote>
────────────────────────────────────────────

<pre>
🏋️ Всего ${exerciseName}: ${numberToEmoji(
      res[definedExercise]
    )}  (+${count}✅)  
⚡ Всего XP: ${res.exp}  (+${amountOfXp}✅)
</pre>  
────────────────────────────────────────────
<blockquote><b>💎 Ваш уровень: ${numberToEmoji(level)}</b>
<b>XP до следующего уровня:</b> ${total_to_next - res.exp}</blockquote>

Продолжай в том же духе!
/help - список команд /fizstatchat — статистика всего чата /fizmystat — ваша статистика
`;

    ctx.reply(resultString, { parse_mode: "HTML" });
  }
  // можно инвокнуть хандлер который покажет стату чата целиком;
}

export async function fizMyStatCmdHandler(ctx) {
  const db = new Db();

//   const res = await db.getUser(ctx.chat.id, ctx.from.id);
  const members = await db.getChatMembers(ctx.chat.id);
//   console.log(members)
  const res = members.find(m => m.id == String(ctx.from.id));

 
  if (!res) {
    return ctx.reply(
      "Ошибка при получении вашей статистики. Попробуй ещё раз. Возможно, вы ещё не выполняли упражнения в этом чате."
    );
  }
  const { level, next_level_xp } = calculateLevel(res.exp);
  const resultString = `
<b>📊 Ваша статистика в ${ctx.chat.title}:</b>
────────────────────────────────────────────
<pre>
🏋️ Отжимания: ${numberToEmoji(res.push_ups)}
🏋️ Подтягивания: ${numberToEmoji(res.pull_ups)}
🏋️ Приседания: ${numberToEmoji(res.sit_ups)}
🏋️ Скручивания: ${numberToEmoji(res.crunches)}
</pre>
────────────────────────────────────────────
<blockquote>⚡ Всего XP: ${res.exp} <b>💎 Ваш уровень: ${numberToEmoji(level)}</b>
<b>XP до следующего уровня:</b> ${next_level_xp - res.exp}
</blockquote>
📅Профиль создан - ${formatTimestamp(res.joined_at)}
📅Последнее обновление - ${formatTimestamp(res.last_update)}

<blockquote>Ваше место в рейтинге чата по опыту: ${getPlayerRank(members, ctx.from.id)} из ${members.length}
Общий опыт всех участников чата: ${sumOfChatExp(members)} XP
</blockquote>
/help - список команд /fizstatchat — статистика всего чата  
`;

  ctx.reply(resultString, { parse_mode: "HTML" });
}


export async function fizChatStatCmdHandler(ctx) {
  const db = new Db();

  const chatId = ctx.chat.id;
  const chatTitle = ctx.chat.title || "этот чат";

  // Получаем всех участников чата
  const members = await db.getChatMembers(chatId);

  if (!members || members.length === 0) {
    return ctx.reply("В этом чате пока нет участников 🙁");
  }

  // Сортировка по XP
  const sorted = [...members].sort((a, b) => b.exp - a.exp);

  // ТОП-10
  const top = sorted.slice(0, 10);

  // Сдeлaть суммы
  const totals = members.reduce(
    (acc, p) => {
      acc.exp += p.exp || 0;
      acc.push_ups += p.push_ups || 0;
      acc.pull_ups += p.pull_ups || 0;
      acc.sit_ups += p.sit_ups || 0;
      acc.crunches += p.crunches || 0;
      return acc;
    },
    { exp: 0, push_ups: 0, pull_ups: 0, sit_ups: 0, crunches: 0 }
  );

  // Формируем блок ТОП-10 игроков
  let topList = "";
  top.forEach((p, i) => {
    const medal =
      i === 0 ? "🥇" :
      i === 1 ? "🥈" :
      i === 2 ? "🥉" :
      "🔹";

    topList += `${medal} <b>${i + 1}.</b> ${p.tg_nickname || p.tg_username || p.id} — <b>${p.exp} XP</b> | lvl ${calculateLevel(p.exp).level}\n`;
  });

  const result = `
<b>📊 Общая статистика чата: ${chatTitle}</b>
────────────────────────────────────────────
<pre>
👥 Участников fiz: ${members.length}

⚡ Общий опыт чата: ${totals.exp} XP | lvl ${calculateLevel(totals.exp).level}  

💪 Всего отжиманий: ${totals.push_ups}
🏋️ Всего подтягиваний: ${totals.pull_ups}
🦵 Всего приседаний: ${totals.sit_ups}
🔥 Всего скручиваний: ${totals.crunches}
</pre>
────────────────────────────────────────────

<b>🏆 ТОП-10 по опыту:</b>
<blockquote>
${topList.trim()}
</blockquote>
`;

  ctx.reply(result, { parse_mode: "HTML" });
}


export function helpHandler(ctx) {

  const aliasText = Object.entries(aliases)
    .map(([key, list]) => {
      return `<b>${key}</b>:\n▫️ ${list.join("\n▫️ ")}`;
    })
    .join("\n\n");

  const helpText = `
<b>📋 Список команд бота FizAcherBot:</b>

<b>/fiz &lt;упражнение&gt; &lt;кол-во&gt;</b> — добавить выполненные упражнения  
Пример: <code>/fiz отжимания 20</code>

<b>/fizmystat</b> — показать вашу статистику  
<b>/fizstatchat</b> — статистика всего чата  
<b>/help</b> — показать это сообщение

──────────────────────────────

<b>🔤 Алиасы упражнений:</b>

${aliasText}
  `;

  ctx.reply(helpText, { parse_mode: "HTML" });
}
