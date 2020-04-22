const moment = require('moment-timezone');

const WeekController = require('../../../Week');

const daysController = require('../../days');

const { getDatesInWeekWithDate } = require('./getDates');

const {
  convertMomentToMyDate,
  getMoment,
  getUtcDateTime
} = require('../../../../utilities/index');

module.exports = {
  createWeekArrayEntryByDate,
  createNextWeek
};

function createWeekArrayEntryByDate(givenDate, job) {
  console.log('- - - CREATE WEEK BY DATE - - -')
  console.log(givenDate);
  console.log('_givenDate__^_^_^_^__')
  console.log(job)
  console.log('_job__^_^_^_^__')
  return new Promise(
    (resolve, reject) => {
      const dates = getDatesInWeekWithDate(givenDate, job.weekBegins);
      const firstDate = dates[0];
      const lastDate = dates[dates.length - 1];
      const newWeekData = {
        firstDate,
        lastDate,
        days: daysController.createDaysForDates(dates, job),
        weekNumber: determineWeekNumber(firstDate, job.effectiveStartDate)
      };
      console.log('+== ==== newWeekData')
      console.log(newWeekData)
      WeekController.create(newWeekData, job._id, job.user)
      .then(weekDoc => {
        console.log('#*#*#*#* - -')
        // console.log(weekDoc)
        return resolve({
          document: weekDoc,
          firstDateUtcTime: getUtcDateTime(firstDate),
          lastDateUtcTime: getUtcDateTime(lastDate)
        });
      })
      .catch(reject);
    }
  );
}

function checkForWeekWithDate() {

}

function createWeekByDate() {
  
}

function createNextWeek(currentWeek, job) {
  const nextWeekFirstDateMoment = getMoment(currentWeek.lastDate).add(1, 'days');
  return createWeekByDate(convertMomentToMyDate(nextWeekFirstDateMoment), job);
}

function determineWeekNumber(weekStartDate, referenceDate) {
  const estimate = getMoment(weekStartDate).diff(getMoment(referenceDate), 'weeks') + 1;
  for (let i = estimate - 1; i < estimate + 2; i++) {
    const idealFirstDateOfWeek = getMoment(referenceDate).add(i - 1, 'weeks');
    const weekFirstDateDiffFromIdeal = idealFirstDateOfWeek.diff(getMoment(weekStartDate), 'days');
    if (-4 < weekFirstDateDiffFromIdeal && weekFirstDateDiffFromIdeal < 4) return i;
  }
  throw new Error('Failed to determine week number.');
}