import {
  addWeekEarningsToTotals,
  addDayEarningsToWeekTotals,
  getDurationInfo,
  formatEarnings,
  isPartialWeekInDateRange,
  isWholeWeekInDateRange,
  isDateInRange,
  getPaidAndUnpaidTotalTime
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
  const totalTime = getDurationInfo(rangeTotals.timeInMsec);
  const earnings = formatEarnings(rangeTotals.earnings);
  return {
    totalTime,
    daysWorked: rangeTotals.daysWorked,
    earnings,
    ...dateRange,
    ...getPaidAndUnpaidTotalTime(earnings, totalTime)
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
  addWeekEarningsToTotals(weekTotals, rangeTotals.earnings);
}
