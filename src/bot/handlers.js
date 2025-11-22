import Db from "../db/index.js";
import {
  defineAlias,
  EXERCISE_DISPLAY_NAMES,
  xpRates,
} from "../types/constants.js";
import { calculateLevel, numberToEmoji } from "./helpers.js";

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

    const {level, next_level_xp} = calculateLevel(res.exp);

    const resultString = `
💪  + *${count}* *${exerciseName}* добавлено!
────────────────────────────────────────────

\`\`\`
🏋️Всего ${exerciseName}: ${numberToEmoji(res[definedExercise])}  (+${count}✅)  
⚡Всего XP: ${res.exp}  (+${amountOfXp}✅)
\`\`\`  
────────────────────────────────────────────
💎Ваш уровень: *${numberToEmoji(level)}* , XP до следующего уровня: *${next_level_xp - res.exp}*

Продолжай в том же духе!
`;

    ctx.reply(resultString, { parse_mode: "Markdown" });
  }
  // можно инвокнуть хандлер который покажет стату чата целиком;
}
