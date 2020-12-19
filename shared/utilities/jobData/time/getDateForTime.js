const moment = require('moment');
const { convertMomentToMyDate } = require('../../dates');
const getBoundariesOfDayWithDate = require('./getBoundariesOfDayWithDate');

module.exports = getDateForTime;

function getDateForTime(time, jobSettings, isRoundedForward) {
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
