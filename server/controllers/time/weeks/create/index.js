const moment = require('moment-timezone');

const WeekController = require('../../../Week');

const daysController = require('../../days');

const { getDatesInWeekWithDate, determineWeekNumber } = require('../../../utilities');

const {
  convertMomentToMyDate,
  getMoment,
  getUtcDateTime
} = require('../../../utilities');

module.exports = {
  createWeekArrayEntryByDate,
  createNextWeek
};

function createWeekArrayEntryByDate(givenDate, job) {
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
      WeekController.create(newWeekData, job._id, job.user)
      .then(weekDoc => {
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

function createNextWeek(currentWeek, job) {
  const nextWeekFirstDateMoment = getMoment(currentWeek.lastDate).add(1, 'days');
  return createWeekByDate(convertMomentToMyDate(nextWeekFirstDateMoment), job);
}
