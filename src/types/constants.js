export const EXERCISE_NAMES = {
    push_ups: "push_ups",
    pull_ups: "pull_ups",
    sit_ups: "sit_ups",
    crunches: "crunches",
};
export const EXERCISE_DISPLAY_NAMES = {
    push_ups: "Отжимания",
    pull_ups: "Подтягивания",
    sit_ups: "Приседания",
    crunches: "Скручивания(пресс)",
};

export const aliases = {
    push_ups: ["отжимания", "pushups", "push_ups", "push-ups", "отжим", "otzhim"],
    pull_ups: ["подтягивания", "pullups", "pull_ups", "pull-ups", "подтяг", "podtyag"],
    sit_ups: ["приседания","присед", "situps", "sit_ups", "sit-ups"],
    crunches: ["скручивания", "crunches", "скруч", "пресс","abs"],
};

export function defineAlias(str) {
    const lowerStr = str.toLowerCase();
    let result = null;
    for (const [key, aliasList] of Object.entries(aliases)) {
        if (aliasList.includes(lowerStr)) {
            result = key;
            console.log('defineAlias:', str, '->', result);
            return key;
        }
    }

    return result;
    
}


export const xpRates = {
        push_ups: 1,
        pull_ups: 1.5,
        sit_ups: 1.2,
        crunches: 0.5,
      };