const { getDateTime, getMoment } = require('./dates');

module.exports = {
  determineWeekNumber,
  getMostRecentScheduleIndexForDate,
  getMostRecentScheduleValueForDate,
  areWagesEquivalent,
  getDateForTime
};

function determineWeekNumber(weekStartDate, referenceDate) {
  const estimate = getMoment(weekStartDate).diff(getMoment(referenceDate), 'weeks') + 1;
  for (let i = estimate - 1; i < estimate + 2; i++) {
    const idealFirstDateOfWeek = getMoment(referenceDate).add(i - 1, 'weeks');
    const weekFirstDateDiffFromIdeal = idealFirstDateOfWeek.diff(getMoment(weekStartDate), 'days');
    if (-4 < weekFirstDateDiffFromIdeal && weekFirstDateDiffFromIdeal < 4) return i;
  }
  throw new Error('Failed to determine week number.');
}

function getMostRecentScheduleIndexForDate(date, valueSchedule) {
  if (valueSchedule.length === 0) return;
  if (valueSchedule.length === 1) return 0;
  const dateTime = getDateTime(date);
  let selectedIndex = 0;
  for (let i = 1; i < valueSchedule.length; i++) {
    if (getDateTime(valueSchedule[i].startDate) > dateTime) {
      return selectedIndex;
    }
    selectedIndex = i;
  }
  return selectedIndex;
}

function getMostRecentScheduleValueForDate(date, valueSchedule) {
  const index = getMostRecentScheduleIndexForDate(date, valueSchedule);
  if (!index && index !== 0) return null;
  return valueSchedule[index].value;
}

function areWagesEquivalent(wage1, wage2) {
  if (!wage1 && !wage2) return true;
  if (!wage1 || !wage2) return false;
  return (
    wage1.rate === wage2.rate &&
    wage1.currency === wage2.currency &&
    wage1.overtime.rate === wage2.overtime.rate &&
    wage1.overtime.rateMultiplier === wage2.overtime.rateMultiplier &&
    wage1.overtime.useMultiplier === wage2.overtime.useMultiplier &&
    wage1.overtime.cutoff === wage2.overtime.cutoff
  );
}

function getDateForTime(time, job, isRoundedForward) {
  let guessMoment;
  let guessDate;
  const guessDayOffsets = [0, 1, -1, 2, -2];
  for (let i = 0; i < guessDayOffsets.length; i++) {
    guessMoment = moment.utc(time).add(guessDayOffsets[i], 'days');
    guessDate = convertMomentToMyDate(guessMoment);
    const precedingDate = convertMomentToMyDate(getMoment(guessDate).subtract(1, 'days'));
    const dayStartCutoff = getMostRecentScheduleValueForDate(precedingDate, job.dayCutoff);
    const dayEndCutoff = getMostRecentScheduleValueForDate(guessDate, job.dayCutoff);
    const dayStartTimezone = getMostRecentScheduleValueForDate(precedingDate, job.timezone);
    const dayEndTimezone = getMostRecentScheduleValueForDate(guessDate, job.timezone);
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