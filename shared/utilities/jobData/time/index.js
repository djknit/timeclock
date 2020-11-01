const getDateForTime = require('./getDateForTime');
const determineWeekNumber = require('./determineWeekNumber');

module.exports = {
  getDateForTime,
  determineWeekNumber,
  ...require('./weekDays')
};