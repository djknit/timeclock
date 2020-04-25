const moment = require('moment-timezone');

const wageValidation = require('./wageValidation');

module.exports = {
  routeErrorHandlerFactory,
  errorHandlerMiddleware,
  getDateTime,
  getDate,
  getMoment,
  convertDateToMyDate,
  convertMomentToMyDate,
  getUtcMoment,
  getUtcDateTime,
  getMostRecentScheduleIndexForDate,
  getMostRecentScheduleValueForDate,
  areDatesEquivalent,
  getFirstDayOfWeekForDate,
  findWeekBeginsSchedIndexForDate,
  areWagesEquivalent,
  isDateValid,
  wageValidation,
  getPrecedingDate
}


// ROUTE ERROR -*-*-*-*-*-*-*-*-*-*-*-*-*-*-<><><>

function routeErrorHandlerFactory(responseObj) {
  return err => {
    if (!err) {
      console.log('No error object in routeErrorHandler. Unknown error.');
      err = { messages: ['Unknown error.'] };
    }
    let { status, messages, message, problems } = err;
    if (!status) status = 500;
    if (!messages) messages = [message || 'An unknown error has occurred.'];
    if (err.type === 'entity.parse.failed') {
      messages.unshift('Improperly formatted request.');
    }
    if (!problems) problems = message ? {} : { unknown: true };
    responseObj.status(status).json({ messages, problems, err });
    if (status === 500) throw err;
  };
}

// Source: https://stackoverflow.com/questions/53048642/node-js-handle-body-parser-invalid-json-error
function errorHandlerMiddleware(err, req, res, next) {
  const errorHandler = routeErrorHandlerFactory(res);

  if (err) {
    errorHandler(err);
    // console.error(err);
    return;
  }

  next();
}


// DATES -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-<><><>

// For converting dates from my { day, month, year } format into a timestamp.
function getDateTime(myDate) {
  return getDate(myDate).getTime();
}

function getDate(myDate) {
  const { day, month, year } = myDate;
  return (new Date(year, month, day));
}

function getPrecedingDate(myDate) {
  return convertMomentToMyDate(getMoment(myDate).subtract(1, 'days'));
}

function getMoment(myDate, timezone) {
  const momentFriendlyDate = getMomentFriendlyDate(myDate);
  return timezone ?
    moment.tz(momentFriendlyDate, timezone) :
    moment(momentFriendlyDate);
}

function getMomentFriendlyDate(myDate) {
  return {
    date: myDate.day,
    year: myDate.year,
    month: myDate.month
  };
}

function getUtcMoment(myDate) {
  return moment.utc(getMomentFriendlyDate(myDate));
}

function getUtcDateTime(myDate) {
  return myDate ? moment.utc(getMomentFriendlyDate(myDate)).valueOf() : null;
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


// JOB DATA -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-<><><>

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

function getMostRecentScheduleIndexForDate(date, valueSchedule) {
  // console.log('\n@-@-@ getMostRecentScheduleIndexForDate ~_~^~_~^~_~')
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
  // console.log('\n@-@-@ getMostRecentScheduleValueForDate ~_~^~_~^~_~')
  console.log(date);
  const index = getMostRecentScheduleIndexForDate(date, valueSchedule);
  if (!index && index !== 0) return null;
  return valueSchedule[index].value;
}


// Determine actual first day of the week that includes the given date. This may be different than the `weekBegins` value given by the value schedule if the value changed less than a week before the date and the corresponding day of the week does not fall between the value `startDate` and the given `date`.
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

// only checks if value goes in to effect by date; doesn't verify that it is the most recent value; also doesn't work if value startDate is "x~~less~than~~x" -> "earlier than" 1 week before given date.
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