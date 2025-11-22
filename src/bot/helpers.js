export function calculateLevel(xp_total) {
    let level = 0;
    let next_level_xp = 100;

    while (xp_total >= next_level_xp) {
        xp_total -= next_level_xp;
        level += 1;
        next_level_xp *= 2; // каждый следующий уровень в 2 раза дороже
    }
    console.log('calculateLevel:', { level, xp_total, next_level_xp });
    return { level, next_level_xp};
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