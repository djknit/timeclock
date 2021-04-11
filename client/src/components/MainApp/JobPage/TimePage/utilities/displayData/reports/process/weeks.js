import { processTotals } from './totals';

export { processWeeksForReport };


function processWeeksForReport(unprocessedWeeks, sessionTimezone) {
  let hasMultipleTimezones = false; // same idea as earnings (see note in `processTimeForReport`)
  const processedWeeks = unprocessedWeeks.map(_week => {
    const processedWeek = processWeek(_week, sessionTimezone);
    if (processedWeek.hasMultipleTimezones) hasMultipleTimezones = true;
    return processedWeek;
  });
  return { hasMultipleTimezones, weeks: processedWeeks };
}

function processWeek(
  { weekNumber, days, isPartial, earnings, totalTime, firstDate, lastDate, paidTime, unpaidTime, weekDocId },
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
    totals: processTotals({ totalTime, earnings, unpaidTime, paidTime }),
    weekNumber,
    dateRange: { firstDate, lastDate },
    days: processedDays,
    weekDocId,
    hasMultipleTimezones
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
    areTimezonesDifferent: settings.timezone !== sessionTimezone,
    reportTimezone: sessionTimezone,
    _id
  };
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
    // * matches descriptions in other related files
/* 
  processed `week`s result should have the form:
    [{
      isPartial,
      totals,
      weekNumber,
      dateRange,
      days: [day],
      weekDocId
    }]

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
