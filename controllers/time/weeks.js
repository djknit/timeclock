const Job = require('../../models/Job');

const { getDateTime, getMoment } = require('../../utilities');

module.exports = {
  addFirstWeek: (job) => new Promise(
    (resolve, reject) => {
      // `weekBegins` is index of weekday 0 - 6, not the actual date. `startDate` is job start date, not week start date.
      const { startDate, weeks, weekBegins } = job;
      if (weeks.length !== 0) {
        const err = new Error('Cannot add first week because the job already has week(s).');
        reject(err);
        throw err;
      }
      const startDateMoment = getMoment(startDate);
      const weekBeginsDateMoment = startDateMoment.day(weekBegins);
      if (weekBeginsDateMoment.valueOf() < startDateMoment.valueOf()) {
        weekBeginsDateMoment = weekBeginsDateMoment.subtract(1, 'weeks');
      }

    }
  )
}