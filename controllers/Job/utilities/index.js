const {
  checkForFailure, getMoment, convertMomentToMyDate, isDateValid, wageValidation
} = require('../../utilities');

module.exports = {
  getMoment,
  convertMomentToMyDate,
  jobNotFoundCheckerFactory,
  checkForFailure,
  isDateValid,
  wageValidation
};

function jobNotFoundCheckerFactory(jobId) {
  return function(job) {
    if (!job) {
      let err = new Error(`No job found for job id "${jobId}".`);
      err.status = 422;
      err.problems = { jobId: true };
      throw err;
    }
    else return job;
  }
}