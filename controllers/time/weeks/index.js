const moment = require('moment-timezone');

const JobController = require('../../Job');
const WeekController = require('../../Week');
const daysController = require('../days');

const { createWeekArrayEntryByDate, createNextWeek } = require('./create');

const {
  getMostRecentScheduleIndexForDate,
  areDatesEquivalent,
  convertMomentToMyDate,
  getUtcDateTime,
  getMostRecentScheduleValueForDate
} = require('../../../utilities');

module.exports = {
  createWeekArrayEntryByDate,
  createNextWeek,
  findWeekWithDate,
  findWeekWithId,
  findWeeksInDateRange,
  deleteSegmentsFromWeeksInDateRange,
  getWeekAndDayIdsForDates,
  findWeeksInDateRanges,
  isWeekInDateRanges
}

function findWeekWithDate(date, weeksArray) {
  const dateUtcTime = getUtcDateTime(date);
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
  return new Promise((resolve, reject) => {
    if (affectedWeeks.length === 0) return resolve(job);
    let numWeeksProcessed = 0;
    for (let i = 0; i < affectedWeeks.length; i++) {
      _deleteSegsFromAffectedWeek(i)
      .then(updatedWeekDoc => {
        job.weeks[i].document = updatedWeekDoc;
        if (++numWeeksProcessed === affectedWeeks.length) {
          return resolve(job);
        }
      })
      .catch(reject);
    }
  });
  function _deleteSegsFromAffectedWeek(i) {
    const weekDoc = affectedWeeks[i].document;
    if (i === 0 || i === affectedWeeks.length - 1) {
      const idsOfAffectedDays = daysController.getIdsOfDaysInRange(firstDateUtcTime, lastDateUtcTime, weekDoc.days);
      return WeekController.removeSegmentsFromDaysWithIds(idsOfAffectedDays, weekDoc._id, userId);
    }
    return WeekController.removeAllSegments(weekDoc._id, userId);
  }
}

function findWeeksInDateRange(firstDateUtcTime, lastDateUtcTime, weeksArray) {
  // return all weeks that have one or more days falling within date range
  return weeksArray.filter(arrayEntry => isWeekInDateRange(firstDateUtcTime, lastDateUtcTime, arrayEntry));
}

function findWeeksInDateRanges(dateRanges, weeksArray) {
  return weeksArray.filter(arrayEntry => isWeekInDateRanges(dateRanges, arrayEntry));
}

function isWeekInDateRange(firstDateUtcTime, lastDateUtcTime, weeksArrayEntry) {
  const weekFirstDateTime = weeksArrayEntry.firstDateUtcTime;
  const weekLastDateTime = weeksArrayEntry.lastDateUtcTime;
  return (
    // is any part of the week within the date range provided?
      // if so then either the first or last days of week (or both) are within date range OR the entire date range is contained within week in which case both the first and last days of date range must fall in week
    (
      (!firstDateUtcTime || firstDateUtcTime <= weekFirstDateTime) &&
      (!lastDateUtcTime || weekFirstDateTime <= lastDateUtcTime)
    ) ||
    (
      (!firstDateUtcTime || firstDateUtcTime <= weekLastDateTime) &&
      (!lastDateUtcTime || weekLastDateTime <= lastDateUtcTime)
    ) ||
    (weekFirstDateTime <= firstDateUtcTime && firstDateUtcTime <= weekLastDateTime)
  );
}

function isWeekInDateRanges(dateRanges, weeksArrayEntry) {
  for (let i = 0; i < dateRanges.length; i++) {
    const { firstDateUtcTime, lastDateUtcTime } = dateRanges[i];
    if (isWeekInDateRange(firstDateUtcTime, lastDateUtcTime, weeksArrayEntry)) {
      return true;
    }
  }
  return false;
}

function getWeekAndDayIdsForDates(dates, weeks) {
  let affectedWeeks = [];
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const week = findWeekWithDate(date, weeks);
    _addIdsForDate(date, week);
  }
  return affectedWeeks.map(el => {
    return {
      weekId: el.week._id.toString(),
      dayIds: el.dayIds
    };
  });
  function _addIdsForDate(date, week) {
    if (!week) return;
    const affectedWeeksIndex = affectedWeeks
    .map(el => el.week._id.toString())
    .indexOf(week._id.toString());
    const dayId = daysController.findDayForDate(date, week.days)._id;
    if (affectedWeeksIndex < 0) {
      affectedWeeks.push({
        week: week,
        dayIds: [dayId]
      });
    }
    else {
      affectedWeeks[affectedWeeksIndex].dayIds.push(dayId);
    }
  }
}