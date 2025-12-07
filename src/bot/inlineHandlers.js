import Db from "../db/index.js";
import {
  defineAlias,
  EXERCISE_DISPLAY_NAMES,
  xpRates,
  aliases,
} from "../types/constants.js";

export async function fizInlineHandler(ctx) {
  const query = ctx.inlineQuery.query.trim();
//   console.log(ctx.update.inline_query.from);
  // Пример: "отжимания 10"

  if (!query) {
    return ctx.answerInlineQuery([
      {
        type: "article",
        id: "empty",
        title: "Введите упражнение",
        description: "Например: отжимания 20",
        input_message_content: {
          message_text: "Напиши: отжимания 20",
        },
      },
    ]);
  }

  const parts = query.split(" ");

  if (parts.length < 2) {
    return ctx.answerInlineQuery([
      {
        type: "article",
        id: "bad_format",
        title: "Неверный формат",
        description: "Используйте: <упражнение> <кол-во>",
        input_message_content: {
          message_text: "Формат: отжимания 20",
        },
      },
    ]);
  }

  const count = parseInt(parts[parts.length - 1], 10);

  if (isNaN(count)) {
    return ctx.answerInlineQuery([
      {
        type: "article",
        id: "no_number",
        title: "Не понял количество",
        description: "Последнее слово должно быть числом",
        input_message_content: {
          message_text: "Пример: отжимания 20",
        },
      },
    ]);
  }

  const exercise = parts.slice(0, -1).join(" ");
  const definedExercise = defineAlias(exercise);

  if (!definedExercise) {
    return ctx.answerInlineQuery([
      {
        type: "article",
        id: "unknown",
        title: "Неизвестное упражнение",
        description: exercise,
        input_message_content: {
          message_text: `Неизвестное упражнение: ${exercise}`,
        },
      },
    ]);
  }

  const exerciseName = EXERCISE_DISPLAY_NAMES[definedExercise];

  // Ответ пользователю — но пока без изменения БД (в inline нельзя)
return ctx.answerInlineQuery([
  {
    type: "article",
    id: "fiz_result",
    title: `Добавить: ${exerciseName} × ${count}`,
    description: "Нажмите, чтобы записать упражнение",
    input_message_content: {
      message_text: `Добавляю ${exerciseName} × ${count}...`,
    },
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Тестовая кнопка", callback_data: "test_button" }
        ]
      ]
    },
  },
]);
}

export async function fizInlineChosenHandler(ctx) {
  const query = ctx.chosenInlineResult.query;
  const parts = query.split(" ");
console.log(ctx);
  const count = parseInt(parts[parts.length - 1], 10);
  const exercise = parts.slice(0, -1).join(" ");
  const definedExercise = defineAlias(exercise);

  const db = new Db();

  const res = await db.addExercise(
    ctx.from.id,
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

  // (Ничего не отвечаем — inline-режим не позволяет)
}
