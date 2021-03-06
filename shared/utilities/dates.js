const moment = require('moment-timezone');

module.exports = {
  getDateTime,
  getDate,
  getMoment,
  getUtcMoment,
  getUtcDateTime,
  convertMomentToMyDate,
  convertDateToMyDate,
  areDatesEquivalent,
  isDateValid,
  getPrecedingDate,
  getNextDate,
  addDaysToDate
};

function getDateTime(myDate) {
  // For converting dates from my { day, month, year } format into a timestamp.
  return getDate(myDate).getTime();
}

function getDate(myDate) {
  const { day, month, year } = myDate;
  return (new Date(year, month, day));
}
function getMoment(myDate, timezone) {
  const momentFriendlyDate = getMomentFriendlyDate(myDate);
  return timezone ?
    moment.tz(momentFriendlyDate, timezone) :
    moment(momentFriendlyDate);
}

function getUtcMoment(myDate) {
  return moment.utc(getMomentFriendlyDate(myDate));
}

function getUtcDateTime(myDate) {
  return myDate ? getUtcMoment(myDate).valueOf() : null;
}

function convertMomentToMyDate(moment_) {
  return {
    day: moment_.date(),
    year: moment_.year(),
    month: moment_.month()
  };
}

function convertDateToMyDate(date) {
  return {
    day: date.getDate(),
    year: date.getFullYear(),
    month: date.getMonth()
  };
}

function areDatesEquivalent(date1, date2) {
  if (!date1 || !date2) {
    throw new Error('Missing date to compare.');
  }
  return (
    date1.day === date2.day &&
    date1.month === date2.month &&
    date1.year === date2.year
  );
}

function isDateValid(val) {
  const { day, month, year } = val;
  const date = new Date(year, month, day);
  if (date.getDate() !== day) return false;
  if (date.getMonth() !== month) return false;
  if (date.getFullYear() !== year) return false;
  return true;
}

function getPrecedingDate(myDate) {
  return convertMomentToMyDate(getMoment(myDate).subtract(1, 'days'));
}

function getNextDate(myDate) {
  return convertMomentToMyDate(getMoment(myDate).add(1, 'days'));
}

function getMomentFriendlyDate(myDate) {
  return {
    date: myDate.day,
    year: myDate.year,
    month: myDate.month
  };
}

function addDaysToDate(date, numDaysToAdd) {
  return convertMomentToMyDate(getMoment(date).add(numDaysToAdd, 'days'));
}
