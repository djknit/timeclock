import { currentJobTimeService } from '../../../../../../data';
import {
  getDateRangeInfo,
  getPaidAndUnpaidTotalTime,
  isWholeWeekInDateRange,
  isPartialWeekInDateRange,
  dates as dateUtils
} from '../../../utilities';

const { isDateInRange } = dateUtils;


function processTimeForReport(
  timeData,
  { // report options
    dateRange,
    durationDecimalPlaces,
    formatters: {
      duration,
      time,
      date,
      currencyAmount,
      payRate,
      dateRange
    } = {},
  } = {}
) {
  const weeksInRange = findWeeksInDateRange(timeData.weeks, dateRange);
  const rangeTotals = getTotals(timeData, dateRange);
  
}

function processTotals(unprocessedTotals) {

}

function findWeeksInDateRange(weeks, dateRange) {
  if (!dateRange.firstDate && !dateRange.lastDate) {
    return weeks;
  }
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

function getTotals(timeData, dateRange = {}) {
  const { firstDate, lastDate } = dateRange;
  return (
    !(dateRange && (firstDate || lastDate)) ?
    extractJobTotalsFromTimeData(timeData) :
    getDateRangeInfo(dateRange, timeData.weeks)
  );
}

function extractJobTotalsFromTimeData({ totalTime, daysWorked, earnings, paidTime, unpaidTime }) {
  const dateRange = {
    firstDate: null,
    lastDate: null
  };
  return { totalTime, daysWorked, earnings, paidTime, unpaidTime, dateRange };
}

function processTotalsForReport({
  totalTime, daysWorked, earnings, paidTime, unpaidTime, dateRange
}) {

}

function processWeeksForReport(unprocessedWeeks) {

}

function processWeekForReport({
  weekNumber, days, isPartial, earnings, totalTime, firstDate, lastDate, unpaidTime, weekDocId
}) {

}

function processDayForReport({
  segments, earnings, date, settings, /* <--not sure if needed */ totalTime, _id
}) {

}

function processSegmentForReport({ _id, duration, startTime, endTime, earnings }) {

}


/* processed time data result should have the form:
    {
      weeks: [{
        isPartial,
        totals: {
          byRate: [{ duration, payRate, amountEarned }],
          byCurrency: [{ duration, amountEarned, currency }],
          unpaid, (duration)
          all (duration)
        },
        weekNumber,
        dateRange ?,
        days: [{
          totals: {
            duration,
            amountEarned
          },
          segments: [{
            duration,
            startTime: {
              sessionTimezone,
              officialTimezone
            },
            endTime,
            payRate,
            amountEarned,
            id
          }],
          currency,
          officialTimezone,
          areTimezonesDifferent,
          id
        }],
        id
      }],
      totals 
    }

    `totals` for week and whole date range (but not day) have the form:
    {
      byRate: [{ duration, payRate, amountEarned }],
      byCurrency: [{ duration, amountEarned, currency }],
      unpaid, (duration)
      all (duration)
    }

    each `payRate` has the form:
    {
      amount,
      isOvertime,
      currency
    }
*/
