const moment = require('moment');
const { convertMomentToMyDate } = require('../../dates');
const getBoundariesOfDayWithDate = require('./getBoundariesOfDayWithDate');

module.exports = getDateForTime;

function getDateForTime(time, jobSettings, isRoundedForward) {
  // Expects job settings to have values in the form used in database. Will not work on front end with settings already processed for display (use raw schedules instead)!
  console.log('time\n', time)
  // console.log('job settings:\n', jobSettings)
  // console.log('isRoundedForward', isRoundedForward)
  let guessMoment;
  let guessDate;
  const guessDayOffsets = [0, 1, -1, 2, -2];
  for (let i = 0; i < guessDayOffsets.length; i++) {
    guessMoment = moment.utc(time).add(guessDayOffsets[i], 'days');
    guessDate = convertMomentToMyDate(guessMoment);
    const {
      startTime: guessDateStartTime,
      endTime: guessDateEndTime
    } = getBoundariesOfDayWithDate(guessDate, jobSettings);
    const isGuessCorrect = (
      isRoundedForward !== false ?
      (guessDateStartTime <= time && time < guessDateEndTime) :
      (guessDateStartTime < time && time <= guessDateEndTime)
    );
    if (isGuessCorrect) {
      return guessDate;
    }
  }
  throw new Error('Failed to get date for time.');
}
