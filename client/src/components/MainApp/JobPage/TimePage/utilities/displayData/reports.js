import { currentJobTimeService } from '../../../../../../data';
import {
  getDateRangeInfo,
  getPaidAndUnpaidTotalTime,
  isWholeWeekInDateRange,
  isPartialWeekInDateRange,
  dates as dateUtils,
  getDurationInfo
} from '../../../utilities';

const { isDateInRange } = dateUtils;

export { processTime };

// See below comment for result object description (end of file)
function processTime(timeData, { dateRange } = {}) {
  const { weeks } = timeData;
  const hasDateRange = !!(dateRange && (dateRange.firstDate || dateRange.lastDate))
  const weeksInRange = hasDateRange ? findWeeksInDateRange(weeks, dateRange) : weeks;
  const rangeTotals = hasDateRange ? getDateRangeInfo(dateRange, weeks) : timeData;
  return {
    weeks: processWeeks(weeksInRange),
    totals: processTotals(rangeTotals)
  };
}

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

function processWeeks(unprocessedWeeks) {
  return unprocessedWeeks.map(processWeek);
}

function processTotals({ totalTime, earnings, unpaidTime }) {
  return {
    ...getProcessedRateAndCurrencyTotals(earnings),
    unpaid: unpaidTime,
    all: totalTime
  };
}

function processWeek({
  weekNumber, days, isPartial, earnings, totalTime, firstDate, lastDate, unpaidTime, weekDocId
}) {
  return {
    isPartial,
    totals: processTotals({ totalTime, earnings, unpaidTime }),
    weekNumber,
    dateRange: { firstDate, lastDate },
    days: days.map(processDay),
    weekDocId
  };
}

function getProcessedRateAndCurrencyTotals(unprocessedEarningsByCurrency) {
  let totalsByRate = [];
  const totalsByCurrency = unprocessedEarningsByCurrency.map(
    ({ amount, currency, rates, totalTime }) => {
      totalsByRate.push(getProcessedRateTotalsForCurrency({ currency, rates }));
      return {
        duration: totalTime,
        amountEarned: amount,
        currency
      };
    }
  );
  return {
    byRate: totalsByRate,
    byCurrency: totalsByCurrency
  };
}

// / / / / / // * *___________^ ^vv^v
// NEEDS COMPLETED * * * * * * * * * *
function processDay({ segments, earnings, date, settings, totalTime, _id }) {
  const unpaidTime = earnings ? totalTime : getDurationInfo(0);
  return {
    totals: processTotals({ totalTime, earnings, unpaidTime }),
    segments: segments.map(processSegment),

  };
}

function getProcessedRateTotalsForCurrency({ currency, rates }) {
  return rates.map(
    ({ amountEarned, duration, isOvertime, rate }) => ({
      duration,
      amountEarned,
      payRate: {
        amount: rate,
        isOvertime,
        currency
      }
    })
  );
}

function processSegment({ _id, duration, startTime, endTime, earnings }) {

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
            _id
          }],
          currency,
          officialTimezone,
          areTimezonesDifferent,
          _id
        }],
        weekDocId
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
