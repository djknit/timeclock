const moment = require('moment-timezone');

const daysController = require('../days');

const {
  getMostRecentScheduleIndexForDate,
  getMostRecentScheduleValueForDate,
  convertMomentToMyDate,
  areDatesEquivalent,
  getFirstDayOfWeekForDate,
  findWeekBeginsSchedIndexForDate,
  getMoment
} = require('../../../utilities/index');

module.exports = {
  createWeekByDate,
  createNextWeek
};

function createWeekByDate(givenDate, job) {
  console.log('- - - CREATE WEEK BY DATE - - -')
  console.log(givenDate);
  console.log('_givenDate__^_^_^_^__')
  console.log(job)
  console.log('_job__^_^_^_^__')
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
      wage: getMostRecentScheduleValueForDate(date, job.wage),
      job: job._id
    });
  });
  const weekNumber = determineWeekNumber(firstDate, job.effectiveStartDate);
  return createDayDocsForWeekDays({
    days,
    firstDate,
    lastDate,
    weekNumber,
    job: job._id
  });
}

function createNextWeek(currentWeek, job) {
  const nextWeekFirstDateMoment = getMoment(currentWeek.lastDate).add(1, 'days');
  return createWeekByDate(convertMomentToMyDate(nextWeekFirstDateMoment), job);
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

function createDayDocsForWeekDays(week) {
  return new Promise(
    (resolve, reject) => {
      console.log('- - - CREATE DAY DOCS FOR WEEK DAYS - - -')
      console.log(week)
      daysController.createDocsForDays(week.days)
      .then(dayDocs => {
        week.days = dayDocs;
        resolve(week);
      });
    }
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

function determineWeekNumber(weekStartDate, referenceDate) {
  // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  // console.log(weekStartDate)
  // console.log(referenceDate)
  const estimate = getMoment(weekStartDate).diff(getMoment(referenceDate), 'weeks') + 1;
  // console.log(estimate)
  for (let i = estimate - 1; i < estimate + 2; i++) {
    const idealFirstDateOfWeek = getMoment(referenceDate).add(i - 1, 'weeks');
    const weekFirstDateDiffFromIdeal = idealFirstDateOfWeek.diff(getMoment(weekStartDate), 'days');
    if (-4 < weekFirstDateDiffFromIdeal && weekFirstDateDiffFromIdeal < 4) return i;
  }
  throw new Error('Failed to determine week number.');
}