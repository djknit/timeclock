const {
  convertMomentToMyDate, getMoment, getDateTime, getPrecedingDate
} = require('../../dates');
const { getMostRecentScheduleEntryForDate } = require('../valueSchedules');

module.exports =  getFirstDayOfWeekForDate;

// Determine actual first day of the week that includes the given date. This may be a different weekday than the `weekBegins` value given by the value schedule for the given date if the value changed less than a week before the date and the corresponding day of the week does not fall between the value `startDate` and the given `date`.
function getFirstDayOfWeekForDate(date, weekBeginsValueSchedule) {
  const mostRecentSchedEntry = getMostRecentScheduleEntryForDate(date, weekBeginsValueSchedule);
  const mostRecentOccuranceOfSchedValue = getMostRecentOccuranceOfWeekday(
    mostRecentSchedEntry.value, date
  );
  return (
    (
      !mostRecentSchedEntry.startDate ||
      getDateTime(mostRecentOccuranceOfSchedValue) >= getDateTime(mostRecentSchedEntry.startDate)
    ) ? (
      { ...mostRecentOccuranceOfSchedValue }
    ) : (
      getFirstDayOfWeekForDate(getPrecedingDate(mostRecentSchedEntry.startDate), weekBeginsValueSchedule)
    )
  );
}

function getMostRecentOccuranceOfWeekday(weekdayIndex, referenceDate) {
  let resultDateMoment = getMoment(referenceDate).day(weekdayIndex);
  if (resultDateMoment.valueOf() > getMoment(referenceDate).valueOf()) {
    resultDateMoment.subtract(1, 'weeks');
  }
  return convertMomentToMyDate(resultDateMoment);
}
