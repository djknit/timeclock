import { getDateRangeInfo } from '../../../../utilities';
import { findWeeksInDateRange } from './find';
import { processWeeksForReport, processTotals } from './process';

export { processTimeForReport };


function processTimeForReport(timeData, { dateRange } = {}) {
  const { weeks, sessionTimezone } = timeData;
  const hasDateRange = !!(dateRange && (dateRange.firstDate || dateRange.lastDate))
  const weeksInRange = hasDateRange ? findWeeksInDateRange(weeks, dateRange) : weeks;
  const rangeTotals = hasDateRange ? getDateRangeInfo(dateRange, weeks) : timeData;
  // See below comment for description of result object (end of this file)
  return {
    ...processWeeksForReport(weeksInRange, sessionTimezone),
    totals: processTotals(rangeTotals),
    hasPaidTime: !!rangeTotals.earnings, // include rate & earnings columns throughout report if there is any paid time anywhere in reported time period
  };
}


// RESULT OBJ FROM `processTimeForReport` DESCRIPTION
    // * matches descriptions in other related files
/*
  processed time data result should have the form:
    {
      weeks: [week],
      totals,
      hasPaidTime,
      hasMultipleTimezones
    }

  `week`s have the form:
    {
      isPartial,
      totals,
      weekNumber,
      dateRange,
      days: [day],
      weekDocId
    }

  `totals` for week and whole date range (but not day) have the form:
    {
      byCurrency: [{
        duration,
        amountEarned,
        byRate: [{ duration, payRate, amountEarned }],
        currency
      }],
      paid, (duration)
      unpaid, (duration)
      all (duration)
    }

  `day`s have the form:
    {
      date,
      totals: {
        duration,
        amountEarned
      },
      segments: [segment],
      currency,
      officialTimezone,
      areTimezonesDifferent,
      _id
    }

  each `payRate` has the form:
    {
      amount,
      isOvertime,
      currency
    }
    || `null` (for unpaid segments)
  
  `segment`s have the form:
    {
      duration,
      times: {
        sessionTimezone: { startTime, endTime },
        officialTimezone: { startTime, endTime }
      },
      payRate,
      amountEarned,
      _id
    }
*/
