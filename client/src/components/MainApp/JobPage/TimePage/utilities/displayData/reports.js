import {
  getDateRangeInfo,
  isWholeWeekInDateRange,
  isPartialWeekInDateRange,
  dates as dateUtils,
  getDurationInfo
} from '../../../utilities';

const { isDateInRange } = dateUtils;

export { processTimeForReport };


function processTimeForReport(timeData, { dateRange } = {}) {
  const { weeks, sessionTimezone } = timeData;
  const hasDateRange = !!(dateRange && (dateRange.firstDate || dateRange.lastDate))
  const weeksInRange = hasDateRange ? findWeeksInDateRange(weeks, dateRange) : weeks;
  const rangeTotals = hasDateRange ? getDateRangeInfo(dateRange, weeks) : timeData;
  // See below comment for description of result object (end of this file)
  return {
    weeks: processWeeks(weeksInRange, sessionTimezone),
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

function processWeeks(unprocessedWeeks, sessionTimezone) {
  return unprocessedWeeks.map(_week => processWeek(_week, sessionTimezone));
}

function processTotals({ totalTime, earnings, unpaidTime }) {
  return {
    ...getProcessedRateAndCurrencyTotals(earnings),
    unpaid: unpaidTime,
    all: totalTime
  };
}

function processWeek(
  { weekNumber, days, isPartial, earnings, totalTime, firstDate, lastDate, unpaidTime, weekDocId },
  sessionTimezone
) {
  return {
    isPartial,
    totals: processTotals({ totalTime, earnings, unpaidTime }),
    weekNumber,
    dateRange: { firstDate, lastDate },
    days: days.map(_day => processDay(_day, sessionTimezone)),
    weekDocId
  };
}

function getProcessedRateAndCurrencyTotals(unprocessedEarningsByCurrency) {
  if (!unprocessedEarningsByCurrency) {
    return { byRate: [], byCurrency: [] };
  }
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

function processDay(
  { segments, earnings, date, settings, totalTime, _id },
  sessionTimezone
) {
  return {
    date,
    totals: {
      duration: totalTime,
      amountEarned: earnings && earnings.amount
    },
    segments: segments.map(processSegment),
    currency: settings.wage && settings.wage.currency,
    officialTimezone: settings.timezone,
    areTimezonesDifferent: settings.timezone === sessionTimezone,
    _id
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
  let payRate = null, amountEarned = null;
  if (earnings) {
    const { currency, rates, amount } = earnings;
    const { rate, isOvertime } = rates[0];
    payRate = { amount: rate, isOvertime, currency };
    amountEarned = amount;
  }
  return {
    duration,
    startTime: _processTime(startTime),
    endTime: _processTime(endTime),
    payRate,
    amountEarned,
    _id
  };

  function _processTime({ altTimezones, ...mainTime }) {
    return {
      sessionTimezone: mainTime,
      officialTimezone: (altTimezones && altTimezones.job) || mainTime
    };
  }
}


// RESULT OBJ FROM `processTimeForReport` DESCRIPTION
/* 
  processed time data result should have the form:
    {
      weeks: [week],
      totals 
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
      byRate: [{ duration, payRate, amountEarned }],
      byCurrency: [{ duration, amountEarned, currency }],
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
      startTime: { sessionTimezone, officialTimezone },
      endTime: { sessionTimezone, officialTimezone },
      payRate,
      amountEarned,
      _id
    }
*/
