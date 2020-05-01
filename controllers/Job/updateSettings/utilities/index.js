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
  getDayEndTimeForDate,
  getFirstDayOfWeekForDate,
  areDatesEquivalent,
  getDatesInWeekWithDate
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
  getDayEndTimeForDate,
  getFirstDayOfWeekForDate,
  areDatesEquivalent,
  getDatesInWeekWithDate,
  saveModifiedWeeks
};

function saveModifiedWeeks(weeksArray, modifiedWeekDocIds) {
  return new Promise((resolve, reject) => {
    let numCompleted = 0;
    for (let i = 0; i < weeksArray.length; i++) {
      const weekDoc = weeksArray[i].document;
      if (modifiedWeekDocIds.indexOf(weekDoc._id.toString()) !== -1) {
        weekDoc.save()
        .then(_weekDoc => {
          weeksArray[i].document = weekDoc;
          if (++numCompleted === weeksArray.length) resolve();
        })
        .catch(reject);
      }
      else if (++numCompleted === weeksArray.length) resolve();
    }
  });
}