import { dates as dateUtils } from './shared';
export { jobData } from './shared';

const { getUtcDateTime } = dateUtils;

function getDayCutoffTime(cutoffValueInMinutes) {
  const minutesPerDay = 24 * 60;
  const cutoffTimeInMinutes = (cutoffValueInMinutes + minutesPerDay) % minutesPerDay;
  let time = {
    hour: Math.floor(cutoffTimeInMinutes / 60),
    minute: cutoffTimeInMinutes % 60,
    is24hr: true
  };
  return time;
}

function findWeekWithDate(date, weeks) {
  const dateTime = getUtcDateTime(date);
  if (!weeks) return null;
  for (let i = 0; i < weeks.length - 1; i++) {
    const { firstDate, lastDate } = weeks[i];
    if (getUtcDateTime(firstDate) <= dateTime && dateTime <= getUtcDateTime(lastDate)) {
      return weeks[i];
    }
  }
  return null;
}

export {
  getDayCutoffTime,
  findWeekWithDate
};