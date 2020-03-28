const moment = require('moment-timezone');

const { areDatesEquivalent, getUtcMoment } = require('../../utilities');

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
      const day = days[i];
      if (areDatesEquivalent(date, day.date)) {
        return day;
      }
    }
  },
  findDayWithId: (dayId, days) => {
    // console.log('findDayWithId');
    // console.log(dayId);
    // console.log(days);
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      if (day._id.toString() === dayId) {
        // console.log('HIT HIT HIT  eowpf afp')
        return day;
      }
    }
  },
  getIdsOfDaysInRange: (firstDateUtcTime, lastDateUtcTime, days) => {
    // console.log('\n- -  - -  - -  - -  -')
    // console.log('getIdsOfDaysInRange')
    // console.log('- -  - -  - -  - -  -')

    return days
    .filter(day => {
      const dayUtcDateTime = getUtcMoment(day.date).valueOf();
      console.log(dayUtcDateTime)
      console.log(firstDateUtcTime <= dayUtcDateTime && dayUtcDateTime <= lastDateUtcTime)
      return firstDateUtcTime <= dayUtcDateTime && dayUtcDateTime <= lastDateUtcTime;
    })
    .map(day => day._id);
  }
};