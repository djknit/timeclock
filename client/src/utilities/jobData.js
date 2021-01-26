import { dates as dateUtils } from './dates';
export { jobData } from './shared';

const { isDateInRange } = dateUtils;

function getDayCutoffTime(cutoffValueInMinutes, is24hr) {
  const minutesPerDay = 24 * 60;
  const cutoffTimeInMinutes = (cutoffValueInMinutes + minutesPerDay) % minutesPerDay;
  let time = {
    hour: Math.floor(cutoffTimeInMinutes / 60),
    minute: cutoffTimeInMinutes % 60,
    is24hr: !!is24hr
  };
  if (!is24hr) {
    time.isPm = time.hour >= 12;
    time.hour = (time.hour % 12) || 12;
  }
  return time;
}

function findWeekWithDate(date, weeks) {
  if (!weeks) return null;
  for (let i = 0; i < weeks.length; i++) {
    if (isDateInRange(weeks[i], date)) {
      return weeks[i];
    }
  }
  return null;
}

function isPartialWeekInDateRange(dateRange, week) {
  return (
    isDateInRange(dateRange, week.firstDate) ||
    isDateInRange(dateRange, week.lastDate) ||
    isDateInRange(week, dateRange.firstDate)
  );
}

function isWholeWeekInDateRange(dateRange, week) {
  return isDateInRange(dateRange, week.firstDate) && isDateInRange(dateRange, week.lastDate);
}

export {
  getDayCutoffTime,
  isPartialWeekInDateRange,
  findWeekWithDate,
  isWholeWeekInDateRange
};
