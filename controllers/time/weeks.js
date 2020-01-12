const moment = require('moment-timezone');

const Job = require('../../models/Job');

const {
  getMostRecentScheduleIndexForDate,
  areDatesEquivalent,
  convertMomentToMyDate,
  getMostRecentScheduleValueForDate
} = require('../../utilities');

module.exports = {
  createWeekByWeekNumber: (weekNumber, job) => new Promise(
    (resolve, reject) => {

    }
  ),
  createWeekByDate: (date, job) => new Promise(
    (resolve, reject) => {
      findFirstDayOfWeekWithDate(date, job);
    }
  ),
  createFirstWeek: () => new Promise(
    (resolve, reject) => {
      const { startDate, weeks, weekBegins } = job;
      if (weeks.length !== 0) {
        const err = new Error('Cannot add first week because the job already has week(s).');
        reject(err);
        throw err;
      }
    }
  )
}


// function addWeek({ weekNumber, date }, job) {
//   return new Promise(
//     (resolve, reject) => {
//       // `weekBegins` is index of weekday 0 - 6, not the actual date. `startDate` is job start date, not week start date.
//       const { startDate, weeks, weekBegins } = job;
//       const startDateMoment = getMoment(startDate);
//       const weekBeginsDateMoment = startDateMoment.day(weekBegins);
//       if (weekBeginsDateMoment.valueOf() < startDateMoment.valueOf()) {
//         weekBeginsDateMoment = weekBeginsDateMoment.subtract(1, 'weeks');
//       }
      
//     }
//   );
// }

// function createFirstWeek(job) {
//   const weekDates = getDatesInWeekWithDate(job.startDate, job.weekBegins);
//   const weekStartDate = weekDates[0];
//   if ()
// }

function createWeekWithDate(givenDate, job) {
  const dates = getDatesInWeekWithDate(givenDate, job.weekBegins);
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];
  let days = [];
  dates.forEach(date => {
    const dayBeforeDate = convertMomentToMyDate(moment(date).subtract(1, 'days'));
    days.push({
      date,
      startCutoff: getMostRecentScheduleValueForDate(dayBeforeDate, job.dayCutoff),
      endCutoff: getMostRecentScheduleValueForDate(date, job.dayCutoff),
      timezone: getMostRecentScheduleValueForDate(date, job.timezone),
      wage: getMostRecentScheduleValueForDate(date, job.wage)
    });
  });
  const referenceDate = areDatesEquivalent(job.startDate, givenDate) ?
    job.startDate :
    job.effectiveStartDate;
  const weekNumber = determineWeekNumber(firstDateOfWeek, referenceDate, job.weekBegins);
}

function getDatesInWeekWithDate(date, weekBeginsValueSchedule) {
  const weekBeginsScheduleIndexForDate = findWeekBeginsSchedIndexForDate(date, weekBeginsValueSchedule);
  const firstDate = getFirstDayOfWeekForDate(
    date, weekBeginsValueSchedule, weekBeginsScheduleIndexForDate
  );
  const dates = getRemainingDatesOfWeekFromFirstDate(
    firstDate, weekBeginsValueSchedule, firstDateWeekBeginsScheduleIndex
  );
}

// Determine actual first day of the week that includes the given date. This may be different than the `weekBegins` value given by the value schedule if the value changed less than a week before the date and the corresponding day of the week does not fall between the value `startDate` and the given `date`.
function getFirstDayOfWeekForDate(date, weekBeginsValueSchedule, weekBeginsScheduleIndex) {
  date = moment(date);
  let firstDate = date.day(weekBeginsValueSchedule[weekBeginsScheduleIndex].value);
  if (firstDate.valueOf() > date.valueOf()) firstDate.subtract(1, 'weeks');
  return convertMomentToMyDate(firstDate);
}

function findWeekBeginsSchedIndexForDate(date, weekBeginsValueSchedule) {
  const mostRecentSheduleIndex = getMostRecentScheduleIndexForDate(date, weekBeginsValueSchedule);
  for (let i = mostRecentSheduleIndex; i > 0; i--) {
    if (isWeekBeginsValueActualFirstDayOfWeek(date, weekBeginsValueSchedule[i])) {
      return i;
    }
  }
  return 0;
}

// only checks if value goes in to effect by date. doesn't verify it is the most recent value.
function isWeekBeginsValueActualFirstDayOfWeek(date, scheduleEntry) {
  const dateMoment = moment(date);
  const weekBeginsStartDateMoment = moment(scheduleEntry.startDate);
  if (dateMoment.subtract(weekBeginsStartDateMoment, 'days') > 6) return true;
  const dayIndexes = {
    date: dateMoment.day(),
    weekBeginsValue: scheduleEntry.value,
    weekBeginsStartDate: weekBeginsStartDateMoment.day()
  }
  const normalize = dayIndex => (dayIndex - dayIndexes.weekBeginsStartDate + 6) % 6;
  const normalizedDayIndexes = {
    date: normalize(dayIndexes.date),
    weekBeginsValue: normalize(dayIndexes.weekBeginsValue),
    weekBeginsStartDate: 0
  };
  return (
    normalizedDayIndexes.weekBeginsStartDate <= normalizedDayIndexes.weekBeginsValue &&
    normalizedDayIndexes.weekBeginsValue <= normalizedDayIndexes.date
  );
}

function getRemainingDatesOfWeekFromFirstDate(
  firstDate, weekBeginsValueSchedule, firstDateWeekBeginsScheduleIndex
) {
  if (weekBeginsValueSchedule.length === 1) {
    return getWeekDatesForStaticWeekBegins(firstDate);
  }
  const firstDateMoment = moment(firstDate);
  const weekBeginsValueChangeMoment = moment(
    weekBeginsValueSchedule[firstDateWeekBeginsScheduleIndex + 1].startDate
  );
  if (firstDateMoment.add(1, 'weeks').valueOf() <= weekBeginsValueChangeMoment.valueOf()) {
    return getWeekDatesForStaticWeekBegins(firstDate);
  }
  return getWeekDatesForChangingWeekBegins(firstDate, weekBeginsValueSchedule);
}

function getWeekDatesForStaticWeekBegins(firstDate) {
  let dates = [];
  for (let i = 0; i < 7; i++) {
    const dateMoment = moment(firstDate).add(i, 'days');
    dates.push(convertMomentToMyDate(dateMoment));
  }
  return dates;
}

function getWeekDatesForChangingWeekBegins(firstDate, weekBeginsValueSchedule) {
  let dates = [firstDate];
  for (let i = 1; i < 7; i++) {
    const dateMoment = moment(firstDate).add(i, 'days');
    const date = convertMomentToMyDate(dateMoment);
    const firstDateOfWeekWithDate = getFirstDayOfWeekForDate(date, weekBeginsValueSchedule);
    if (!areDatesEquivalent(firstDate, firstDateOfWeekWithDate)) {
      return dates;
    }
    dates.push(date);
  }
  return dates;
}

function getWeekNumberForWeekFromStartDate(weekStartDate, referenceDate, weekBeginsValueSchedule) {
  const estimate = moment(weekStartDate).diff(moment(referenceDate), 'weeks') + 1;
  for (let i = estimate - 1; i < estimate + 2; i++) {
    const idealFirstDateOfWeekNumber = moment(referenceDate).add(i - 1, 'weeks');
    const weekFirstDateDiffFromIdeal = idealFirstDateOfWeekNumber.diff(moment(weekStartDate), 'days');
    if (-4 < weekFirstDateDiffFromIdeal && weekFirstDateDiffFromIdeal < 4) return weekNumber;
  }
  throw new Error('Failed to determine week number.');
}