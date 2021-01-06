const {
  weeks: weeksController,
  days: daysController
} = require('../../../timePieces');
const { getOrphanedSegments, placeOrphanedSegmentsWithAdoptiveDays } = require('./orphanedSegments');

const { getMostRecentScheduleValueForDate, getPrecedingDate, saveModifiedWeeks } = require('../utilities');

module.exports = {
  updateOtherPropForWeeksAndDays
};

function updateOtherPropForWeeksAndDays(job, allAffectedTimespans, propName) {
  return new Promise((resolve, reject) => {
    let modifiedWeekDocIds = [];
    let orphanedSegments = [];
    job.weeks.forEach(week => {
      if (weeksController.isWeekInDateRanges(allAffectedTimespans, week)) {
        modifiedWeekDocIds.push(week.document._id.toString());
        updateDaysInWeek(week.document, job, allAffectedTimespans, propName, orphanedSegments);
      }
    });
    placeOrphanedSegmentsWithAdoptiveDays(orphanedSegments, job, modifiedWeekDocIds, propName)
    .then(() => saveModifiedWeeks(job.weeks, modifiedWeekDocIds))
    .then(() => resolve(job))
    .catch(reject);
  });
}

function updateDaysInWeek(weekDoc, job, allAffectedTimespans, propName, orphanedSegments) {
  let fieldNames = {
    main: propName === 'dayCutoff' ? 'endCutoff' : propName
  };
  const isDayBoundaryAffected = propName === 'dayCutoff' || propName === 'timezone';
  if (isDayBoundaryAffected) {
    fieldNames.start = propName === 'dayCutoff' ? 'startCutoff' : 'startTimezone';
  }
  weekDoc.days.forEach(day => {
    if (!daysController.isDayInDateRanges(allAffectedTimespans, day)) return;
    day[fieldNames.main] = getMostRecentScheduleValueForDate(day.date, job[propName]);
    if (isDayBoundaryAffected) {
      day[fieldNames.start] = getMostRecentScheduleValueForDate(getPrecedingDate(day.date), job[propName]);
      orphanedSegments.push(...getOrphanedSegments(day, propName));
    }
  });
}
