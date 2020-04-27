const {
  checkForFailure,
  isDateValid,
  getUtcDateTime,
  findScheduleEntryById,
  wageValidation,
  jobNotFoundCheckerFactory,
  findScheduleIndexByEntryId,
  getMostRecentScheduleValueForDate,
  getPrecedingDate,
  getDayEndTimeForDate
} = require('../../utilities');

module.exports = {
  checkForFailure,
  isDateValid,
  getUtcDateTime,
  findScheduleEntryById,
  wageValidation,
  get methodNames() {
    return ['add', 'changeDate', 'remove', 'edit'];
  },
  jobNotFoundCheckerFactory,
  findScheduleIndexByEntryId,
  getMostRecentScheduleValueForDate,
  getPrecedingDate,
  getDayEndTimeForDate
};