const moment = require('moment-timezone');

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
  createDayByDate
};

function createDayByDate(date, job) {
  const timezone = getMostRecentScheduleValueForDate(date, job.timezone);
  const wage = getMostRecentScheduleValueForDate(date, job.wage);
  const startCutoff = getMostRecentScheduleValueForDate(date, job.startCutoff);
  const endCutoff = getMostRecentScheduleValueForDate(date, job.endCutoff);
  return {
    timezone,
    wage,
    startCutoff,
    endCutoff,
    date
  };
}

function findDayForSegmentAndCreateDayIfNoneExists(segment, job) {
  const 
}

function findDayByDateAndCreateDayIfNoneExists() {
  
}