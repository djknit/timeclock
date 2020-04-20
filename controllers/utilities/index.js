const {
  getUtcMoment,
  getMoment,
  convertMomentToMyDate,
  isDateValid,
  wageValidation,
  getMostRecentScheduleValueForDate,
  getPrecedingDate
} = require('../../utilities');

module.exports = {
  getUtcMoment,
  getMoment,
  checkForFailure,
  convertMomentToMyDate,
  isDateValid,
  wageValidation,
  getMostRecentScheduleValueForDate,
  getPrecedingDate
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