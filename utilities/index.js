const moment = require('moment-timezone');

module.exports = {
  routeErrorHandlerFactory,
  errorHandlerMiddleware,
  getDateTime,
  getDate,
  getMoment,
  convertDateToMyDate,
  convertMomentToMyDate,
  getMostRecentScheduleIndexForDate,
  getMostRecentScheduleValueForDate,
  areDatesEquivalent
}


// ROUTE ERROR -*-*-*-*-*-*-*-*-*-*-*-*-*-*-<><><>

function routeErrorHandlerFactory(responseObj) {
  return err => {
    if (!err) {
      console.log('No error object in routeErrorHandler. Unknown error.');
      err = { messages: ['Unknown error.'] };
    }
    if (!err.status) err.status = 500;
    if (!err.messages) {
      err.messages = [err.message || 'An unknown error has occurred.'];
    }
    else if (err.message) err.messages.push(err.message);
    if (err.type === 'entity.parse.failed') {
      err.messages.unshift('Improperly formatted request.');
    }
    responseObj.status(err.status).json({
      messages: err.messages,
      problems: err.problems || (err.message ? {} : { unknown: true }),
      err
    });
    if (err.status === 500) throw err;
  };
}

// Source: https://stackoverflow.com/questions/53048642/node-js-handle-body-parser-invalid-json-error
function errorHandlerMiddleware(err, req, res, next) {
  const errorHandler = routeErrorHandlerFactory(res);

  if (err) {
    errorHandler(err);
    console.error(err);
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

function getMoment(myDate) {
  return moment(myDate);
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
    date1.year !== date2.year
  );
}


// JOB DATA -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-<><><>

function getMostRecentScheduleIndexForDate(date, valueSchedule) {
  if (valueSchedule.length === 1) return null;
  if (valueSchedule.length === 1) return 0;
  const dateTime = moment(date).valueOf();
  let selectedIndex = 0;
  for (let i = 1; i < valueSchedule.length; i++) {
    if (moment(valueSchedule[i].startDate).valueOf() > dateTime) {
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