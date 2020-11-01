import {
  dates as dateUtils,
  addWeekEarningsTotals,
  addDayEarningsToWeekTotals,
  getDurationInfo,
  formatEarningsForCurrency
} from './utilities';

const { getUtcDateTime } = dateUtils;

export default getDateRangeInfo;


function getDateRangeInfo(firstDate, lastDate, processedWeeks) {
  const rangeFirstDateTime = getUtcDateTime(firstDate);
  const rangeLastDateTime = getUtcDateTime(lastDate);
  let rangeTotals = {
    timeInMsec: 0,
    daysWorked: 0,
    earnings: []
  };

  processedWeeks.forEach(week => {
    if (isWholeWeekInDateRange(rangeFirstDateTime, rangeLastDateTime, week)) {
      rangeTotals.timeInMsec += week.totalTime.durationInMsec;
      rangeTotals.daysWorked += week.daysWorked;
      addWeekEarningsTotals(week, rangeTotals.earnings);
    }
    else if (isPartialWeekInDateRange(rangeFirstDateTime, rangeLastDateTime, week)) {
      const weekTotalsInRange = getTotalsOfDaysInDateRange(rangeFirstDateTime, rangeLastDateTime, week.days);
      rangeTotals.timeInMsec += weekTotalsInRange.timeInMsec;
      rangeTotals.daysWorked += weekTotalsInRange.daysWorked;
      addWeekEarningsTotals(weekTotalsInRange, rangeTotals);
    }
  });

  return {
    totalTime: getDurationInfo(rangeTotals.timeInMsec),
    daysWorked: rangeTotals.daysWorked,
    earnings: rangeTotals.earnings.length > 0 ? rangeTotals.earnings.map(formatEarningsForCurrency) : null,
    firstDate,
    lastDate
  };
}

function getTotalsOfDaysInDateRange(firstDateUtcTime, lastDateUtcTime, days) {
  let totals = {
    timeInMsec: 0,
    daysWorked: 0,
    earnings: []
  };
  days.forEach(day => {
    const dayDateTime = getUtcDateTime(day.date);
    const dayTimeInMsec = day.totalTime.durationInMsec;
    if (dayDateTime < firstDateUtcTime || dayDateTime > lastDateUtcTime) {
      return; 
    }
    totals.timeInMsec += dayTimeInMsec;
    if (dayTimeInMsec > 0) {
      totals.daysWorked++;
    }
    addDayEarningsToWeekTotals(day, totals.earnings);
  });
  return totals;
}

function isWholeWeekInDateRange(firstDateUtcTime, lastDateUtcTime, week) {
  const weekFirstDateUtcTime = getUtcDateTime(week.firstDate);
  const weekLastDateUtcTime = getUtcDateTime(week.lastDate);
  return (
    firstDateUtcTime <= weekFirstDateUtcTime && weekFirstDateUtcTime <= lastDateUtcTime &&
    firstDateUtcTime <= weekLastDateUtcTime && weekLastDateUtcTime <= lastDateUtcTime
  );
}

function isPartialWeekInDateRange(firstDateUtcTime, lastDateUtcTime, week) {
  const weekFirstDateUtcTime = getUtcDateTime(week.firstDate);
  const weekLastDateUtcTime = getUtcDateTime(week.lastDate);
  return (
    (firstDateUtcTime <= weekFirstDateUtcTime && weekFirstDateUtcTime <= lastDateUtcTime) ||
    (firstDateUtcTime <= weekLastDateUtcTime && weekLastDateUtcTime <= lastDateUtcTime) ||
    (weekFirstDateUtcTime <= firstDateUtcTime && firstDateUtcTime <= weekLastDateUtcTime)
  );
}

