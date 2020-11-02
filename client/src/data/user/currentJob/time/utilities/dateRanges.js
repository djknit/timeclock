import { dates as dateUtils } from '../../utilities';

const { getUtcDateTime } = dateUtils;

export {
  isPartialWeekInDateRange,
  isWholeWeekInDateRange,
  isDateInRange
};

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

function isDateInRange(dateRange, date) {
  const { firstDate, lastDate } = dateRange;
  const firstDateUtcTime = getUtcDateTime(firstDate);
  const lastDateUtcTime = getUtcDateTime(lastDate);
  const dateUtcTime = getUtcDateTime(date);
  return firstDateUtcTime <= dateUtcTime && dateUtcTime <= lastDateUtcTime;
}
