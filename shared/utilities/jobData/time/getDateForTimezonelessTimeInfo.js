const { addDaysToDate, getMoment } = require('../../dates');
const getBoundariesOfDayWithDate = require('./getBoundariesOfDayWithDate');
const getTzAndCutoffsForDayWithDate = require('./getTzAndCutoffsForDayWithDate');
const { isTimestampInDay } = require('./elemental');

module.exports = getDateForTimezonelessTimeInfo;


function getDateForTimezonelessTimeInfo({ date, time } = {}, jobSettings, isRoundedForward) {
  if (!date || !time) {
    throw new Error('Missing required input `date` or `time` needed to find day for segment.');
  }
  if (time.hour === 12) time.hour = 0;
  if (time.is24hr && time.amPm === 'pm') time.hour += 12;
  time.amPm = time.is24hr = undefined;
  let guessDate;
  for (let i = 0; i < 8; i++) {
    const guessDayOffset = (i % 2 === 0 ? i : (-i - 1)) / 2;
    guessDate = addDaysToDate(date, guessDayOffset);
    const dayWithDateSettings = getTzAndCutoffsForDayWithDate(date, jobSettings);
    const dayBoundaries = getBoundariesOfDayWithDate(guessDate, jobSettings, dayWithDateSettings);
    const guessTimestamp = getMoment({ ...date, ...time }, dayWithDateSettings.timezone);
    const isGuessCorrect = isTimestampInDay(guessTimestamp, dayBoundaries, isRoundedForward);
    if (isGuessCorrect) {
      return guessDate;
    }
  }
  throw new Error('Failed to get date for time info.')
}
