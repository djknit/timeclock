import { dates as dateUtils } from '../../utilities';

const { isDateInRange } = dateUtils;

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
