const moment = require('moment-timezone');

const {
  getMostRecentScheduleIndexForDate,
  getMostRecentScheduleValueForDate,
  convertMomentToMyDate,
  areDatesEquivalent,
  getFirstDayOfWeekForDate,
  findWeekBeginsSchedIndexForDate
} = require('../../../utilities/index');

module.exports = {
  createWeekByDate
};

function createWeekByDate(givenDate, job) {
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
  const weekNumber = determineWeekNumber(firstDate, referenceDate);
  return {
    days,
    firstDate,
    lastDate,
    weekNumber
  };
}

function getDatesInWeekWithDate(date, weekBeginsValueSchedule) {
  const weekBeginsScheduleIndexForDate = findWeekBeginsSchedIndexForDate(date, weekBeginsValueSchedule)
  const firstDate = getFirstDayOfWeekForDate(
    date, weekBeginsValueSchedule, weekBeginsScheduleIndexForDate
  );
  const dates = getRemainingDatesOfWeekFromFirstDate(
    firstDate, weekBeginsValueSchedule, weekBeginsScheduleIndexForDate
  );
  return dates;
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

function determineWeekNumber(weekStartDate, referenceDate) {
  const estimate = moment(weekStartDate).diff(moment(referenceDate), 'weeks') + 1;
  for (let i = estimate - 1; i < estimate + 2; i++) {
    const idealFirstDateOfWeek = moment(referenceDate).add(i - 1, 'weeks');
    const weekFirstDateDiffFromIdeal = idealFirstDateOfWeek.diff(moment(weekStartDate), 'days');
    if (-4 < weekFirstDateDiffFromIdeal && weekFirstDateDiffFromIdeal < 4) return i;
  }
  throw new Error('Failed to determine week number.');
}