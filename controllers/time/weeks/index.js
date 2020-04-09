const moment = require('moment-timezone');

const JobController = require('../../Job');
const WeekController = require('../../Week');
const daysController = require('../days');

const { createWeekArrayEntryByDate, createNextWeek } = require('./create');

const {
  getMostRecentScheduleIndexForDate,
  areDatesEquivalent,
  convertMomentToMyDate,
  getUtcMoment,
  getMostRecentScheduleValueForDate
} = require('../../../utilities');

module.exports = {
  createWeekArrayEntryByDate,
  createNextWeek,
  findWeekWithDate,
  findWeekWithId,
  findWeeksInDateRange,
  deleteSegmentsFromWeeksInDateRange
}

function findWeekWithDate(date, weeksArray) {
  const dateUtcTime = getUtcMoment(date).valueOf();
  for (let i = 0; i < weeksArray.length; i++) {
    const { firstDateUtcTime, lastDateUtcTime, document } = weeksArray[i];
    if (firstDateUtcTime <= dateUtcTime && dateUtcTime <= lastDateUtcTime) {
      return document;
    }
  }
  return null;
}

function findWeekWithId(weekId, job) {
  return new Promise((resolve, reject) => {
    const { weeks } = job;
    for (let i = 0; i < weeks.length; i++) {
      const { document } = weeks[i];
      console.log('+- -'.repeat(20))
      console.log(document._id.toString())
      console.log(weekId.toString())
      console.log('+- -'.repeat(20))
      if (document._id.toString() === weekId.toString()) {
        return resolve(document);
      }
    }
    let err = new Error('No week found with `weekId`.');
    reject(err);
    throw err;
  });
}

function deleteSegmentsFromWeeksInDateRange(firstDateUtcTime, lastDateUtcTime, job, userId) {
  const affectedWeeks = findWeeksInDateRange(firstDateUtcTime, lastDateUtcTime, job.weeks);
  console.log('\n*_ *_ *___*');
  console.log(affectedWeeks);
  return new Promise((resolve, reject) => {
    if (affectedWeeks.length === 0) return resolve(job);
    let numWeeksProcessed = 0;
    for (let i = 0; i < affectedWeeks.length; i++) {
      _deleteSegsFromAffectedWeek(i)
      .then(updatedWeekDoc => {
        console.log('\ncompleted _deleteSegsFromAffectedWeek\n')
        job.weeks[i].document = updatedWeekDoc;
        if (++numWeeksProcessed === affectedWeeks.length) {
          return resolve(job);
        }
      })
      .catch(reject);
    }
  });
  function _deleteSegsFromAffectedWeek(i) {
    console.log('_deleteSegsFromAffectedWeek')
    const weekDoc = affectedWeeks[i].document;
    if (i === 0 || i === affectedWeeks.length - 1) {
      const idsOfAffectedDays = daysController.getIdsOfDaysInRange(firstDateUtcTime, lastDateUtcTime, weekDoc.days);
      return WeekController.removeSegmentsFromDaysWithIds(idsOfAffectedDays, weekDoc._id, userId);
    }
    return WeekController.removeAllSegments(weekDoc._id, userId);
  }
}

function findWeeksInDateRange(firstDateUtcTime, lastDateUtcTime, weeksArray) {
  return weeksArray
  .filter(arrayEntry => {
    const weekFirstDateTime = arrayEntry.firstDateUtcTime;
    const weekLastDateTime = arrayEntry.lastDateUtcTime;
    return (
      // is any part of the week within the date range provided?
        // if so then either the first or last days of week (or both) are within date range OR the entire date range is contained within week in which case both the first and last days of date range must fall in week
      (firstDateUtcTime <= weekFirstDateTime && weekFirstDateTime <= lastDateUtcTime) ||
      (firstDateUtcTime <= weekLastDateTime && weekLastDateTime <= lastDateUtcTime) ||
      (weekFirstDateTime <= firstDateUtcTime && firstDateUtcTime <= weekLastDateTime)
    );
  });
}

// function _deleteSegsFromAffectedWeekInDateRange(firstDateUtcTime, lastDateUtcTime, affectedWeeks, i, userId) {
//   const weekDoc = affectedWeeks[i].data.document;
//   if (i === 0 || i === affectedWeeks.length - 1) {
//     const daysAffectedIds = daysController.getIdsOfDaysInRange(firstDateUtcTime, lastDateUtcTime, weekDoc.data.days);
//     return WeekController.removeSegmentsFromDatesWithIds(daysAffectedIds, week._id, userId);
//   }
//   return WeekController.removeAllSegments(week._id, userId);
// }