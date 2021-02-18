const getTzAndCutoffsForDayWithDate = require('./getTzAndCutoffsForDayWithDate');
const { getMoment } = require('../../dates');

module.exports = getBoundariesOfDayWithDate;

function getBoundariesOfDayWithDate(date, jobSettings, daySetttings = undefined) {
  const {
    startCutoff, endCutoff, startTimezone, timezone
  } = daySetttings || getTzAndCutoffsForDayWithDate(date, jobSettings);
  return {
    startTime: getMoment(date, startTimezone).valueOf() + startCutoff,
    endTime: getMoment(date, timezone).add(1, 'days').valueOf() + endCutoff
  };
}
