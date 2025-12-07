export function calculateLevel(xp_total) {
    let level = 0;
    let next_level_xp = 100;
    let total_to_next = 100;

    while (xp_total >= next_level_xp) {
        xp_total -= next_level_xp;
        level += 1;
        next_level_xp *= 2;
        total_to_next += next_level_xp;
    }
//   console.log(total_to_next-xp_total)
    return { 
        level, 
        next_level_xp,       // цена СЛЕДУЮЩЕГО апа
        total_to_next        // общий XP до следующего уровня
    };
}

export function numberToEmoji(number) {
    const str = number.toString().replace('.', ','); // меняем точку на запятую, если нужно
    const chars = str.split('');

    const emojiMap = {
        '0': '0️⃣',
        '1': '1️⃣',
        '2': '2️⃣',
        '3': '3️⃣',
        '4': '4️⃣',
        '5': '5️⃣',
        '6': '6️⃣',
        '7': '7️⃣',
        '8': '8️⃣',
        '9': '9️⃣',
        ',': '‚' // или оставляем просто ',' (можно заменить на любой символ)
    };

    return chars.map(c => emojiMap[c] || c).join('');
}


export function formatTimestamp(ts) {
    if (!ts || typeof ts.toDate !== "function") return "—";

    return ts.toDate().toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export function getPlayerRank(players, userId) {
    // Копируем массив чтобы не мутировать исходный
    const sorted = [...players].sort((a, b) => b.exp - a.exp);

    // Ищем индекс игрока
    const index = sorted.findIndex(p => p.id === userId);

    // Если игрока нет
    if (index === -1) return null;

    // Место = индекс + 1
    return index + 1;
}

export function sumOfChatExp(members) {
    return members.reduce((sum, member) => sum + (member.exp || 0), 0);
}

