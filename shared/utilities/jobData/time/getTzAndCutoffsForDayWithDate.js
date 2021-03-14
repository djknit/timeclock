const {
  convertMomentToMyDate,
  getMoment
} = require('../../dates');
const { getMostRecentScheduleValueForDate } = require('../valueSchedules');

module.exports = getTzAndCutoffsForDayWithDate;


function getTzAndCutoffsForDayWithDate(date, jobSettings) {
  const precedingDate = convertMomentToMyDate(getMoment(date).subtract(1, 'days'));
  return {
    startCutoff: getMostRecentScheduleValueForDate(precedingDate, jobSettings.dayCutoff),
    endCutoff: getMostRecentScheduleValueForDate(date, jobSettings.dayCutoff),
    startTimezone: getMostRecentScheduleValueForDate(precedingDate, jobSettings.timezone),
    timezone: getMostRecentScheduleValueForDate(date, jobSettings.timezone)
  };
}
