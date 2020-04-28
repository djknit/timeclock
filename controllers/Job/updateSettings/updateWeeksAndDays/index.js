const moment = require('moment');

const weeksController = require('../../../time/weeks');
const daysController = require('../../../time/days');
const WeekController = require('../../../Week');
const segmentsController = require('../../../time/segments');
const JobController = require('../../index');

const { getOrphanedSegments, placeOrphanedSegmentsWithAdoptiveDays } = require('./orphanedSegments');

const { getMostRecentScheduleValueForDate, getPrecedingDate, methodNames } = require('../utilities');

module.exports = updateWeeksAndDays;

function updateWeeksAndDays(job, affectedTimespans, propName) {
  return new Promise((resolve, reject) => {
    const allAffectedTimespans = getAllAffectedTimespans(affectedTimespans, propName);
    let modifiedWeekDocIds = [];
    let orphanedSegments = [];
    job.weeks.forEach(week => {
      if (weeksController.isWeekInDateRanges(allAffectedTimespans, week)) {
        modifiedWeekDocIds.push(week.document._id.toString());
        updateDaysInWeek(week.document, job, allAffectedTimespans, propName, orphanedSegments);
      }
    });
    placeOrphanedSegmentsWithAdoptiveDays(orphanedSegments, job, modifiedWeekDocIds)
    .then(() => saveModifiedWeeks(job.weeks, modifiedWeekDocIds))
    .then(() => resolve(job))
    .catch(reject);
  });
}

function getAllAffectedTimespans(affectedTimespans, propName) {
  let allAffectedTimespans = [];
  methodNames.forEach(method => {
    allAffectedTimespans.push(...affectedTimespans[method])
  });
  if (propName === 'dayCutoff' || propName === 'timezone') {
    allAffectedTimespans.forEach(adjustTimespanToIncludeSucceedingDate);
  }
  return allAffectedTimespans;
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
    day[mainFieldName] = getMostRecentScheduleValueForDate(day.date, job[propName]);
    if (isDayBoundaryAffected) {
      day[fieldNames.start] = getMostRecentScheduleValueForDate(getPrecedingDate(day.date), job[propName]);
      orphanedSegments.push(...getOrphanedSegments(day));
    }
  });
}

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

function adjustTimespanToIncludeSucceedingDate(timespan) {
  timespan.lastDateUtcTime = moment.utc(timespan.lastDateUtcTime).add(1, 'days').valueOf();
}