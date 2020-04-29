const {
  getUtcMoment,
  getUtcDateTime,
  getMoment,
  convertMomentToMyDate,
  isDateValid,
  wageValidation,
  getMostRecentScheduleValueForDate,
  getPrecedingDate,
  areDatesEquivalent
} = require('../../utilities');

module.exports = {
  getUtcMoment,
  getUtcDateTime,
  getMoment,
  checkForFailure,
  convertMomentToMyDate,
  isDateValid,
  wageValidation,
  getMostRecentScheduleValueForDate,
  getPrecedingDate,
  getFirstDayOfWeekForDate,
  areDatesEquivalent,
  findWeekBeginsSchedIndexForDate
};

function checkForFailure(failCondition, failMsg, problemsObj, statusCode) {
  if (!failCondition) return;
  let message, messages;
  if (Array.isArray(failMsg)) {
    message = failMsg.join(' ');
    messages = failMsg;
  }
  else {
    message = failMsg;
  }
  let err = new Error(message);
  err.messages = messages;
  err.problems = problemsObj || {};
  if (statusCode) err.status = statusCode;
  throw err;
}


// Determine actual first day of the week that includes the given date. This may be a different weekday than the `weekBegins` value given by the value schedule for the given date if the value changed less than a week before the date and the corresponding day of the week does not fall between the value `startDate` and the given `date`.
function getFirstDayOfWeekForDate(date, weekBeginsValueSchedule, weekBeginsScheduleIndex) {
  if (!weekBeginsScheduleIndex && weekBeginsScheduleIndex !== 0) {
    weekBeginsScheduleIndex = findWeekBeginsSchedIndexForDate(date, weekBeginsValueSchedule);
  }
  let firstDate = getMoment(date).day(weekBeginsValueSchedule[weekBeginsScheduleIndex].value);
  if (firstDate.valueOf() > getMoment(date).valueOf()) {
    firstDate.subtract(1, 'weeks');
  }
  return convertMomentToMyDate(firstDate);
}

function findWeekBeginsSchedIndexForDate(date, weekBeginsValueSchedule) {
  const mostRecentSheduleIndex = getMostRecentScheduleIndexForDate(date, weekBeginsValueSchedule);
  for (let i = mostRecentSheduleIndex; i > 0; i--) {
    if (isWeekBeginsValueActualFirstDayOfWeek(date, weekBeginsValueSchedule[i])) {
      return i;
    }
  }
  return 0;
}

// only checks if value goes in to effect by date; doesn't verify that it is the most recent value.
function isWeekBeginsValueActualFirstDayOfWeek(date, scheduleEntry) {
  const weekBeginsStartDateMoment = getMoment(scheduleEntry.startDate);
  if (getMoment(date).diff(weekBeginsStartDateMoment, 'days') > 6) {
    return true;
  }
  const dayIndexes = {
    date: getMoment(date).day(),
    weekBeginsValue: scheduleEntry.value,
    weekBeginsStartDate: weekBeginsStartDateMoment.day()
  };
  const normalize = dayIndex => (dayIndex - dayIndexes.weekBeginsStartDate + 6) % 6;
  const normalizedDayIndexes = {
    date: normalize(dayIndexes.date),
    weekBeginsValue: normalize(dayIndexes.weekBeginsValue),
    weekBeginsStartDate: 0
  };
  return normalizedDayIndexes.weekBeginsValue <= normalizedDayIndexes.date;
}