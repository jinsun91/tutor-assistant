import dayjs from 'dayjs';

export function getMonth(month = dayjs().month()) {
    const year = dayjs().year();
    const firstDayOfWeek = dayjs(new Date(year, month, 1)).day();
    let currentDayCount = 0 - firstDayOfWeek;
    const daysMatrix = new Array(5).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            currentDayCount++;
            return dayjs(new Date(year, month, currentDayCount));
        });
    });
    return daysMatrix;
}