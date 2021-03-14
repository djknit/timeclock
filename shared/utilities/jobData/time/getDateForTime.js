const moment = require('moment');
const { convertMomentToMyDate } = require('../../dates');
const getBoundariesOfDayWithDate = require('./getBoundariesOfDayWithDate');
const { isTimestampInDay } = require('./elemental');

module.exports = getDateForTime;


function getDateForTime(time, jobSettings, isRoundedForward) {
  // Expects job settings to have values in the form used in database. Will not work on front end with settings already processed for display (use raw schedules instead)!
  let guessMoment;
  let guessDate;
  const guessDayOffsets = [0, 1, -1, 2, -2];
  for (let i = 0; i < guessDayOffsets.length; i++) {
    guessMoment = moment.utc(time).add(guessDayOffsets[i], 'days');
    guessDate = convertMomentToMyDate(guessMoment);
    const dayBoundaries = getBoundariesOfDayWithDate(guessDate, jobSettings);
    const isGuessCorrect = isTimestampInDay(time, dayBoundaries, isRoundedForward);
    if (isGuessCorrect) {
      return guessDate;
    }
  }
  throw new Error('Failed to get date for time.');
}
