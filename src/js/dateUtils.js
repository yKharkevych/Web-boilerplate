
export function getDaysUntilBirthday(birthDate) {
    if (!birthDate) {
        return null;
    }

    const dateString = String(birthDate).slice(0, 10);
    const birthday = dayjs(dateString);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString) ||
        !birthday.isValid() ||
        birthday.format('YYYY-MM-DD') !== dateString) {
        return null;
    }

    const today = dayjs().startOf('day');

    const month = birthday.month() + 1;
    const day = birthday.date();

    function birthdayInYear(year) {
        const isLeapYear =
            year % 4 === 0 &&
            (year % 100 !== 0 || year % 400 === 0);

        if (month === 2 && day === 29 && !isLeapYear) {
            return dayjs(`${year}-03-01`);
        }

        const monthString = String(month).padStart(2, '0');
        const dayString = String(day).padStart(2, '0');

        return dayjs(`${year}-${monthString}-${dayString}`);
    }

    let nextBirthday = birthdayInYear(today.year());

    // Якщо день народження минув, беремо наступний рік
    if (nextBirthday.isBefore(today)) {
        nextBirthday = birthdayInYear(today.year() + 1);
    }

    // Повертаємо кількість календарних днів
    return nextBirthday.diff(today, 'day');
}
