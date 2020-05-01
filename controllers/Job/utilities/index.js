const {
  checkForFailure,
  getMoment,
  convertMomentToMyDate,
  isDateValid,
  wageValidation,
  getUtcMoment,
  getUtcDateTime,
  getMostRecentScheduleValueForDate,
  getPrecedingDate,
  getFirstDayOfWeekForDate,
  areDatesEquivalent
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
  getDayEndTimeForDate,
  findScheduleEntryById,
  findScheduleIndexByEntryId,
  getFirstDayOfWeekForDate,
  areDatesEquivalent
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

function findScheduleEntryById(id, schedule, excludeFirstEntry, requireSuccess) {
  return schedule[findScheduleIndexByEntryId(id, schedule, excludeFirstEntry, requireSuccess)];
}

function findScheduleIndexByEntryId(id, schedule, excludeFirstEntry, requireSuccess) {
  for (let i = (excludeFirstEntry ? 1 : 0); i < schedule.length; i++) {
    if (schedule[i]._id.toString() === id.toString()) return i;
  }
  if (requireSuccess) throw new Error('Failed to find schedule index by entry id');
}