import {
  dates as dateUtils,
  addWeekEarningsTotals
} from './utilities';

const { getUtcDateTime } = dateUtils;

export default getDateRangeInfo;


function getDateRangeInfo(firstDate, lastDate, processedWeeks) {
  const rangeStartTime = getUtcDateTime(firstDate);
  const rangeEndTime = getUtcDateTime(lastDate);
  let rangeTotals = {
    timeInMsec: 0,
    daysWorked: 0,
    earnings: []
  };

  processedWeeks.forEach(week => {
    if (isWholeWeekInDateRange(week)) {
      rangeTotals.timeInMsec += week.totalTime.durationInMsec;
      rangeTotals.daysWorked += week.daysWorked;
      // look at earnings calc to see if same fxn can be used here as for the job totals
      addWeekEarningsTotals(week, rangeTotals.earnings);
    }
    else if (isPartialWeekInDateRange) {
      
    }
  });
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

