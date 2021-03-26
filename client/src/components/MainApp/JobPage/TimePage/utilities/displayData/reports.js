import {
  getDateRangeInfo,
  isWholeWeekInDateRange,
  isPartialWeekInDateRange,
  dates as dateUtils,
  getDurationInfo
} from '../../../utilities';

const { isDateInRange } = dateUtils;

export { processTime };


function processTime(timeData, { dateRange } = {}) {
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
  const unpaidTime = earnings ? totalTime : getDurationInfo(0);
  return {
    date,
    totals: processTotals({ totalTime, earnings, unpaidTime }),
    segments: segments.map(processSegment),
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
  return {
    duration,
    startTime: {
      sessionTimezone: startTime,
      officialTimezone
    },
    endTime: {
      sessionTimezone: endTime,
      officialTimezone
    }
  };
}


// RESULT OBJ FROM `processTime` DESCRIPTION
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
  
  `segment`s have the form:
    {
      duration,
      startTime: {
        sessionTimezone,
        officialTimezone
      },
      endTime,
      payRate,
      amountEarned,
      _id
    }
*/
