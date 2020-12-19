const {
  convertMomentToMyDate,
  getMoment
} = require('../../dates');
const { getMostRecentScheduleValueForDate } = require('../valueSchedules');

module.exports = getBoundariesOfDayWithDate;

function getBoundariesOfDayWithDate(date, jobSettings) {
  const precedingDate = convertMomentToMyDate(getMoment(date).subtract(1, 'days'));
  const dayStartCutoff = getMostRecentScheduleValueForDate(precedingDate, jobSettings.dayCutoff);
  const dayEndCutoff = getMostRecentScheduleValueForDate(date, jobSettings.dayCutoff);
  const dayStartTimezone = getMostRecentScheduleValueForDate(precedingDate, jobSettings.timezone);
  const dayEndTimezone = getMostRecentScheduleValueForDate(date, jobSettings.timezone);
  return {
    startTime: getMoment(date, dayStartTimezone).valueOf() + dayStartCutoff,
    endTime: getMoment(date, dayEndTimezone).add(1, 'days').valueOf() + dayEndCutoff
  };
}
