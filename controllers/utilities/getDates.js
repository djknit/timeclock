const {
  getFirstDayOfWeekForDate, findWeekBeginsSchedIndexForDate, convertMomentToMyDate, areDatesEquivalent, getMoment
} = require('.');

module.exports = {
  getDatesInWeekWithDate
};

function getDatesInWeekWithDate(date, weekBeginsValueSchedule) {
  const weekBeginsScheduleIndexForDate = findWeekBeginsSchedIndexForDate(date, weekBeginsValueSchedule)
  const firstDate = getFirstDayOfWeekForDate(
    date, weekBeginsValueSchedule, weekBeginsScheduleIndexForDate
  );
  return getRemainingDatesOfWeekFromFirstDate(
    firstDate, weekBeginsValueSchedule, weekBeginsScheduleIndexForDate
  );
}

function getRemainingDatesOfWeekFromFirstDate(
  firstDate, weekBeginsValueSchedule, firstDateWeekBeginsScheduleIndex
) {
  if (weekBeginsValueSchedule.length === 1) {
    return getWeekDatesForStaticWeekBegins(firstDate);
  }
  const firstDateMoment = getMoment(firstDate);
  const weekBeginsValueChangeMoment = getMoment(
    weekBeginsValueSchedule[firstDateWeekBeginsScheduleIndex + 1].startDate
  );
  if (firstDateMoment.add(1, 'weeks').valueOf() <= weekBeginsValueChangeMoment.valueOf()) {
    return getWeekDatesForStaticWeekBegins(firstDate);
  }
  return getWeekDatesForChangingWeekBegins(firstDate, weekBeginsValueSchedule);
}

function getWeekDatesForStaticWeekBegins(firstDate) {
  let dates = [];
  for (let i = 0; i < 7; i++) {
    const dateMoment = getMoment(firstDate).add(i, 'days');
    dates.push(convertMomentToMyDate(dateMoment));
  }
  return dates;
}

function getWeekDatesForChangingWeekBegins(firstDate, weekBeginsValueSchedule) {
  let dates = [firstDate];
  for (let i = 1; i < 7; i++) {
    const dateMoment = getMoment(firstDate).add(i, 'days');
    const date = convertMomentToMyDate(dateMoment);
    const firstDateOfWeekWithDate = getFirstDayOfWeekForDate(date, weekBeginsValueSchedule);
    if (!areDatesEquivalent(firstDate, firstDateOfWeekWithDate)) {
      return dates;
    }
    dates.push(date);
  }
  return dates;
}
