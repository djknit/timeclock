const moment = require('moment-timezone');

const { areDatesEquivalent } = require('../../utilities');

const {
  getMostRecentScheduleValueForDate,
  convertMomentToMyDate,
  getMoment
} = require('../../utilities');

module.exports = {
  createDaysForDates: (dates, job) => {
    return dates.map(date => {
      const dayBeforeDate = convertMomentToMyDate(getMoment(date).subtract(1, 'days'));
      return {
        date,
        startCutoff: getMostRecentScheduleValueForDate(dayBeforeDate, job.dayCutoff),
        endCutoff: getMostRecentScheduleValueForDate(date, job.dayCutoff),
        timezone: getMostRecentScheduleValueForDate(date, job.timezone),
        wage: getMostRecentScheduleValueForDate(date, job.wage),
        job: job._id
      };
    });
  },
  findDayForDate: (date, days) => {
    for (let i = 0; i < days.length; i++) {
      if (areDatesEquivalent(date, days[i].date)) {
        return days[i];
      }
    }
  }
};