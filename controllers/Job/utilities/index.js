const {
  checkForFailure,
  getMoment,
  convertMomentToMyDate,
  isDateValid,
  wageValidation,
  getUtcMoment,
  getUtcDateTime,
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
  getUtcDateTime,
  getMostRecentScheduleValueForDate,
  getPrecedingDate,
  getDayStartTimeForDate,
  getDayEndTimeForDate
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

function getDayStartTimeForDate(date, job) {
  const precedingDate = getPrecedingDate(date);
  const startCutoff = getMostRecentScheduleValueForDate(precedingDate, job.dayCutoff);
  const startTimezone = getMostRecentScheduleValueForDate(precedingDate, job.timezone);
  return getMoment(date, startTimezone).valueOf() + startCutoff;
}

function getDayEndTimeForDate(date, job) {
  const endCutoff = getMostRecentScheduleValueForDate(date, job.dayCutoff);
  const timezone = getMostRecentScheduleValueForDate(date, job.timezone);
  return getMoment(date, timezone).add(1, 'days').valueOf() + endCutoff;
}