import {
  isWholeWeekInDateRange,
  isPartialWeekInDateRange,
  dates as dateUtils
} from '../../../../utilities';

const { isDateInRange } = dateUtils;

export { findWeeksInDateRange };


function findWeeksInDateRange(weeks, dateRange) {
  let weeksInRange = [];
  weeks.forEach(week => {
    if (isWholeWeekInDateRange(dateRange, week)) {
      weeksInRange.push(week);
    }
    else if (isPartialWeekInDateRange(dateRange, week)) {
      weeksInRange.push({
        ...week,
        days: week.days.filter(({ date }) => isDateInRange(dateRange, date)),
        isPartial: true
      });
    }
  });
  return weeksInRange;
}
