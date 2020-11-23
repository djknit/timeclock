const { areDatesEquivalent, getNextDate } = require('../../dates');
const getFirstDayOfWeekForDate = require('./getFirstDayOfWeekForDate');

module.exports = getDatesInWeekWithDate;

function getDatesInWeekWithDate(date, weekBeginsValueSchedule) {
  const firstDate = getFirstDayOfWeekForDate(
    date, weekBeginsValueSchedule
  );
  return getRemainingDatesOfWeekFromFirstDate(
    firstDate, weekBeginsValueSchedule
  );
}

function getRemainingDatesOfWeekFromFirstDate(firstDate, weekBeginsValueSchedule) {
  let dates = [firstDate];
  let i = 0;
  while (dates.length === ++i) {
    const nextDate = getNextDate(dates[dates.length - 1]);
    const isNextDateInWeek = areDatesEquivalent(
      firstDate, getFirstDayOfWeekForDate(nextDate, weekBeginsValueSchedule)
    );
    if (isNextDateInWeek) {
      dates.push(nextDate);
    }
  }
  return dates;
}
