import {
  dates as dateUtils,
  addWeekEarningsTotals,
  addDayEarningsToWeekTotals,
  getDurationInfo,
  formatEarningsForCurrency,
  isPartialWeekInDateRange,
  isWholeWeekInDateRange,
  isDateInRange
} from './utilities';

export default getDateRangeInfo;


function getDateRangeInfo(dateRange, processedWeeks) {
  let rangeTotals = {
    timeInMsec: 0,
    daysWorked: 0,
    earnings: []
  };
  processedWeeks.forEach(week => {
    if (!isPartialWeekInDateRange(dateRange, week)) return;
    const weekTotalsInRange = getWeekTotalsInDateRange(dateRange, week);
    addWeekTotalsToRangeTotals(weekTotalsInRange, rangeTotals);
  });
  return {
    totalTime: getDurationInfo(rangeTotals.timeInMsec),
    daysWorked: rangeTotals.daysWorked,
    earnings: rangeTotals.earnings.length > 0 ? rangeTotals.earnings.map(formatEarningsForCurrency) : null,
    ...dateRange
  };
}

function getWeekTotalsInDateRange(dateRange, week) {
  if (isWholeWeekInDateRange(dateRange, week)) {
    return {
      ...week,
      timeInMsec: week.totalTime.durationInMsec
    };
  }
  let weekTotalsInRange = {
    timeInMsec: 0,
    daysWorked: 0,
    earnings: []
  };
  week.days.forEach(day => {
    const dayTimeInMsec = day.totalTime.durationInMsec;
    if (!isDateInRange(dateRange, day.date)) return;
    weekTotalsInRange.timeInMsec += dayTimeInMsec;
    if (dayTimeInMsec > 0) weekTotalsInRange.daysWorked++;
    addDayEarningsToWeekTotals(day, weekTotalsInRange.earnings);
  });
  return weekTotalsInRange;
}

function addWeekTotalsToRangeTotals(weekTotals, rangeTotals) {
  rangeTotals.timeInMsec += weekTotals.timeInMsec;
  rangeTotals.daysWorked += weekTotals.daysWorked;
  addWeekEarningsTotals(weekTotals, rangeTotals.earnings);
}
