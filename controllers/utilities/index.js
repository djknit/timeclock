const { getUtcMoment, getMoment, convertMomentToMyDate, isDateValid, wageValidation } = require('../../utilities');

module.exports = {
  getUtcMoment,
  getMoment,
  checkForFailure,
  convertMomentToMyDate,
  isDateValid,
  wageValidation
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