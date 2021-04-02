import {
  getDateRangeInfo,
  isWholeWeekInDateRange,
  isPartialWeekInDateRange,
  dates as dateUtils
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
    ...processWeeksForReport(weeksInRange, sessionTimezone),
    totals: processTotals(rangeTotals),
    hasPaidTime: !!rangeTotals.earnings, // include rate & earnings columns throughout report if there is any paid time anywhere in reported time period
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

function processWeeksForReport(unprocessedWeeks, sessionTimezone) {
  let hasMultipleTimezones = false; // same idea as earnings (see note in `processTimeForReport`)
  const processedWeeks = unprocessedWeeks.map(_week => {
    const processedWeek = processWeek(_week, sessionTimezone);
    if (processedWeek.hasMultipleTimezones) hasMultipleTimezones = true;
    return processedWeek;
  });
  return { hasMultipleTimezones, weeks: processedWeeks };
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
  let hasMultipleTimezones = false;
  const processedDays = days.map(_day => {
    const processedDay = processDay(_day, sessionTimezone);
    if (processedDay.areTimezonesDifferent) hasMultipleTimezones = true;
    return processedDay;
  });
  return {
    isPartial,
    totals: processTotals({ totalTime, earnings, unpaidTime }),
    weekNumber,
    dateRange: { firstDate, lastDate },
    days: processedDays,
    weekDocId,
    hasMultipleTimezones
  };
}

function getProcessedRateAndCurrencyTotals(unprocessedEarningsByCurrency) {
  if (!unprocessedEarningsByCurrency) {
    return { byRate: [], byCurrency: [] };
  }
  const totalsByCurrency = unprocessedEarningsByCurrency.map(
    ({ amount, currency, rates, totalTime }) => {
      return {
        duration: totalTime,
        amountEarned: amount,
        currency,
        byRate: getProcessedRateTotalsForCurrency({ currency, rates })
      };
    }
  );
  return {
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
    reportTimezone: sessionTimezone,
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
  let times = { sessionTimezone: {}, officialTimezone: {} };
  _processTime(startTime, 'startTime');
  _processTime(endTime, 'endTime');
  return {
    duration,
    times,
    payRate,
    amountEarned,
    _id,
  };

  function _processTime({ altTimezones, ...mainTime }, name) {
    times.sessionTimezone[name] = mainTime;
    times.officialTimezone[name] = (altTimezones && altTimezones.job) || mainTime;
  }
}


// RESULT OBJ FROM `processTimeForReport` DESCRIPTION
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
