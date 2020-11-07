const moment = require('moment');
const {
  convertMomentToMyDate,
  getMoment
} = require('../../dates');
const {
  getMostRecentScheduleValueForDate
} = require('../valueSchedules')

module.exports = getDateForTime;

function getDateForTime(time, jobSettings, isRoundedForward) {
  let guessMoment;
  let guessDate;
  const guessDayOffsets = [0, 1, -1, 2, -2];
  for (let i = 0; i < guessDayOffsets.length; i++) {
    guessMoment = moment.utc(time).add(guessDayOffsets[i], 'days');
    guessDate = convertMomentToMyDate(guessMoment);
    const precedingDate = convertMomentToMyDate(getMoment(guessDate).subtract(1, 'days'));
    const dayStartCutoff = getMostRecentScheduleValueForDate(precedingDate, jobSettings.dayCutoff);
    const dayEndCutoff = getMostRecentScheduleValueForDate(guessDate, jobSettings.dayCutoff);
    const dayStartTimezone = getMostRecentScheduleValueForDate(precedingDate, jobSettings.timezone);
    const dayEndTimezone = getMostRecentScheduleValueForDate(guessDate, jobSettings.timezone);
    const guessDateStartTime = getMoment(guessDate, dayStartTimezone).valueOf() + dayStartCutoff;
    const guessDateEndTime = getMoment(guessDate, dayEndTimezone).add(1, 'days').valueOf() + dayEndCutoff;
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

