const {
  checkForFailure,
  getMoment,
  convertMomentToMyDate,
  isDateValid,
  wageValidation,
  getUtcMoment,
  getMostRecentScheduleValueForDate,
  getPrecedingDate
} = require('../../utilities');

module.exports = {
  getMoment,
  convertMomentToMyDate,
  jobNotFoundCheckerFactory,
  checkForFailure,
  isDateValid,
  wageValidation,
  getUtcMoment,
  getMostRecentScheduleValueForDate,
  getPrecedingDate
};

function jobNotFoundCheckerFactory(jobId) {
  return function jobNotFoundChecker(job) {
    if (!job) {
      let err = new Error(`No job found for job id "${jobId}".`);
      err.status = 422;
      err.problems = { jobId: true };
      throw err;
    }
    return job;
  }
}