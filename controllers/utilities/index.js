const { getUtcMoment } = require('../../utilities');

module.exports = {
  getUtcMoment,
  checkForFailure
};

function checkForFailure(failCondition, failMsg, problemsObj, statusCode) {
  if (!failCondition) return;
  let err = new Error(failMsg);
  err.problems = problemsObj || {};
  if (statusCode) err.status = statusCode;
  throw err;
}