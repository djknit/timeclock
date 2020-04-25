const moment = require('moment');

const weeksController = require('../../time/weeks');
const daysController = require('../../time/days');
const WeekController = require('../../Week');
const segmentsController = require('../../time/segments');
const JobController = require('../index');

const {
  getMostRecentScheduleValueForDate, getPrecedingDate, getDayStartTimeForDate, getDayEndTimeForDate
} = require('../utilities');

module.exports = updateWeeksAndDays;

function updateWeeksAndDays(job, affectedTimespans, propName) {
  console.log('\n@-@-@ UPDATE WEEKS AND DAYS ~_~^~_~^~_~')
  console.log(affectedTimespans)
  const allAffectedTimespans = [
    ...affectedTimespans.add,
    ...affectedTimespans.changeDate,
    ...affectedTimespans.remove,
    ...affectedTimespans.edit
  ];
  return (
    (propName === 'wage' && updateWageForWeeksAndDays(job, allAffectedTimespans)) ||
    (propName === 'weekBegins' && updateWeekBeginsForWeeksAndDays(job, allAffectedTimespans)) ||
    updateDayCutoffOrTimezoneForWeeksAndDays(job, allAffectedTimespans, propName)
  );
}

function updateWeekBeginsForWeeksAndDays(job, allAffectedTimespans) {
  // update weeks array entry and Week doc
    // (firstDateUtcTime & lastDateUtcTime in array entry; firstDate, lastDate, & weekNumber in weekDoc)
    // * get affected weeks
    // * calculate firstDate, lastDate, & weekNumber for each day in week.
      // * if any of the values don't match, update week values and move days as needed to restore consistency
  // move days between weeks to force compliance w/ new week start and end date times.
    // not sure if previous steps can be conducted in that order; need to experiment
}

function updateWageForWeeksAndDays(job, allAffectedTimespans) {
  console.log('\n@-@-@ UPDATE OTHER PROP FOR WEEKS AND DAYS ~_~^~_~^~_~')
  // either update all days in affected weeks or update affected days.
    // when updating, check to see if segments are bumped off the edge of day.
  return new Promise((resolve, reject) => {
    const weekAndDayIdsWithUpdatedProps = getAffectedWeekAndDayIdsWithUpdatedProps(
      allAffectedTimespans, job, 'wage'
    );
    if (weekAndDayIdsWithUpdatedProps.length === 0) return resolve(job);
    let numCompleted = 0;
    for (let i = 0; i < weekAndDayIdsWithUpdatedProps.length; i++) {
      const { weekId, days } = weekAndDayIdsWithUpdatedProps[i];
      WeekController.updateJobSettingsForDays(days, weekId)
      .then(updatedWeekDoc => {
        placeUpdatedWeekDocInWeeksArray(updatedWeekDoc, job.weeks);
        if (++numCompleted === weekAndDayIdsWithUpdatedProps.length) {
          return resolve(job);
        }
      });
    }
  });
}

function updateDayCutoffOrTimezoneForWeeksAndDays(job, allAffectedTimespans, propName) {
  console.log('\n@-@-@ UPDATE DAY-CUTOFF OR TIMEZONE ~_~^~_~^~_~')
  return new Promise((resolve, reject) => {
    allAffectedTimespans.forEach(adjustTimespanToIncludeSucceedingDate);
    let modifiedWeekDocIds = [];
    let orphanedSegments = [];
    job.weeks.forEach(week => {
      if (!weeksController.isWeekInDateRanges(allAffectedTimespans, week)) return;
      modifiedWeekDocIds.push(week.document._id.toString());
      updateDayCutoffOrTimezoneForDaysInWeek(week.document, job, allAffectedTimespans, propName, orphanedSegments);
    });
    // console.log(job.weeks);
    placeOrphanedSegmentsWithAdoptiveDays(orphanedSegments, job, modifiedWeekDocIds)
    .then(() => saveModifiedWeeks(job.weeks, modifiedWeekDocIds))
    .then(() => resolve(job))
    .catch(reject);
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

// function updateDayCutoffOrTimezoneForAllDays(job, allAffectedTimespans, propName) {
//   for (let i = 0; i < job.weeks.length; i++) {
//     const week = job.weeks[i];
//     if (weeksController.isWeekInDateRanges(allAffectedTimespans, week)) {
//       updateDayCutoffOrTimezoneForDaysInWeek(week.document, job, allAffectedTimespans, propName);
//     }
//   }
// }

function updateDayCutoffOrTimezoneForDaysInWeek(weekDoc, job, allAffectedTimespans, propName, orphanedSegments) {
  const fieldNames = (
    propName === 'timezone' ?
    {
      main: 'timezone',
      start: 'startTimezone'
    } :
    {
      main: 'endCutoff',
      start: 'startCutoff'
    }
  );
  weekDoc.days.forEach(day => {
    console.log('\n************************', day.date);
    if (!daysController.isDayInDateRanges(allAffectedTimespans, day)) return;
    console.log('pass')
    // console.log(day.date)
    // console.log(getPrecedingDate(day.date))
    // console.log(getMostRecentScheduleValueForDate(day.date, job[propName]))
    // console.log(getMostRecentScheduleValueForDate(getPrecedingDate(day.date), job[propName]));
    day[fieldNames.main] = getMostRecentScheduleValueForDate(day.date, job[propName]);
    day[fieldNames.start] = getMostRecentScheduleValueForDate(getPrecedingDate(day.date), job[propName]);
    orphanedSegments.push(...getOrphanedSegments(day));
  });
}

function placeOrphanedSegmentsWithAdoptiveDays(orphanedSegments, job, modifiedWeekDocIds) {
  return new Promise((resolve, reject) => {
    if (orphanedSegments.length === 0) return resolve();
    ensureSegmentsSpanOnlyOneDayEach(orphanedSegments, job);
    let numCompleted = 0;
    orphanedSegments.forEach(segment => {
      placeOrphanedSegmentWithAdoptiveDay(segment, job, modifiedWeekDocIds)
      .then(() => {
        if (++numCompleted === orphanedSegments.length) {
          return resolve();
        }
      })
      .catch(reject);
    });
  });
}

function placeOrphanedSegmentWithAdoptiveDay(segment, job, modifiedWeekDocIds) {
  return new Promise((resolve, reject) => {
    const date = segmentsController.getDateForTime(segment.startTime, job, true);
    getWeekDocWithDate(date, job)
    .then(weekDoc => {
      modifiedWeekDocIds.push(weekDoc._id.toString());
      const day = daysController.findDayForDate(date, weekDoc.days);
      day.segments.push(segment);
      day.segments.sort((seg_1, seg_2) => seg_1.startTime - seg_2.startTime);
      resolve();
    })
  });
}

function getWeekDocWithDate(date, job) {
  return new Promise((resolve, reject) => {
    const weekDoc = weeksController.findWeekWithDate(date, job.weeks);
    if (weekDoc) return resolve(weekDoc);
    JobController.createAndAddWeekWithDate(date, job)
    .then(newWeekArrayEntry => {
      placeNewWeekInWeeksArray(job.weeks, newWeekArrayEntry);
      return resolve(weeksController.findWeekWithDate(date, job.weeks));
    })
    .catch(reject);
  });
}

function placeNewWeekInWeeksArray(weeksArray, newWeekArrayEntry) {
  for (let i = 0; i < weeksArray.length; i++) {
    if (weeksArray[i].firstDateUtcTime > newWeekArrayEntry.firstDateUtcTime) {
      weeksArray.splice(i, 0, newWeekArrayEntry);
      return;
    }
  }
}

function ensureSegmentsSpanOnlyOneDayEach(segments, job) {
  let stillOrphanedSegments = [];
  segments.forEach(segment => ensureSegmentSpansOnlyOneDay(segment, job, stillOrphanedSegments));
  if (stillOrphanedSegments.length > 0) {
    segments.push(...stillOrphanedSegments);
    ensureSegmentsSpanOnlyOneDayEach(segments, job);
  }
}

function ensureSegmentSpansOnlyOneDay(segment, job, stillOrphanedSegments) {
  const startTimeDate = segmentsController.getDateForTime(segment.startTime, job, true);
  const endTimeDate = segmentsController.getDateForTime(segment.endTime, job, false);
  if (startTimeDate.day !== endTimeDate.day) {
    const startTimeDateEndTime = getDayEndTimeForDate(startTimeDate, job);
    stillOrphanedSegments.push({
      startTime: startTimeDateEndTime,
      endTime: segment.endTime
    });
    segment.endTime = startTimeDateEndTime;
  }
}

function getOrphanedSegments(day) {
  let orphanedSegments = [];
  const dayStartTime = daysController.getDayStartTime(day);
  const dayEndTime = daysController.getDayEndTime(day);
  day.segments.forEach(segment => {
    const { startTime, endTime } = segment;
    if (startTime < dayStartTime) {
      orphanedSegments.push({
        startTime: startTime,
        endTime: dayStartTime
      });
      segment.startTime = dayStartTime;
    }
    if (endTime > dayEndTime) {
      orphanedSegments.push({
        startTime: dayEndTime,
        endTime: endTime
      });
      segment.endTime = dayEndTime;
    }
  });
  return orphanedSegments;
}

function adjustTimespanToIncludeSucceedingDate(timespan) {
  timespan.lastDateUtcTime = moment.utc(timespan.lastDateUtcTime).add(1, 'days').valueOf();
  return timespan;
}

function getAffectedWeekAndDayIdsWithUpdatedProps(timespans, job, propName) {
  console.log('\n@-@-@ getAffectedWeekAndDayIdsWithUpdatedProps ~_~^~_~^~_~')
  return getWeekDocIdsAndDaysInTimespans(timespans, job.weeks)
  .map(({ weekId, days }) => ({
    weekId,
    days: turnDaysIntoDayIdsWithUpdatedProps(days, propName, job[propName])
  }));
}

function getWeekDocIdsAndDaysInTimespans(timespans, weeksArray) {
  const affectedWeeks = weeksController.findWeeksInDateRanges(timespans, weeksArray);
  return affectedWeeks
  .map(weeksArrayEntry => ({
    weekId: weeksArrayEntry.document._id,
    days: daysController.getDaysInDateRanges(timespans, weeksArrayEntry.document.days)
  }));
}

function turnDaysIntoDayIdsWithUpdatedProps(days, propName, propValueSchedule) {
  console.log('\n@-@-@ turnDaysIntoDayIdsWithUpdatedProps ~_~^~_~^~_~')
  console.log(days)
  return days.map(
    ({ _id, date }) => ({
      id: _id,
      updates: getUpdatedPropsForDayWithDate(date, propName, propValueSchedule)
    })
  );
}

function getUpdatedPropsForDayWithDate(date, propName, propValueSchedule) {
  console.log('\n@-@-@ getUpdatedPropsForDayWithDate ~_~^~_~^~_~')
  let fieldName_1 = fieldName_2 = 'days.$.';
  if (propName === 'dayCutoff') {
    fieldName_1 += 'endCutoff';
    fieldName_2 += 'startCutoff';
  }
  else {
    fieldName_1 += propName;
    fieldName_2 += 'startTimezone'
  }
  let updatedProps = {
    [fieldName_1]: getMostRecentScheduleValueForDate(date, propValueSchedule)
  };
  if (propName !== 'wage') {
    const precedingDate = getPrecedingDate(date);
    updatedProps[fieldName_2] = getMostRecentScheduleValueForDate(precedingDate, propValueSchedule);
  }
  return updatedProps;
}

function placeUpdatedWeekDocInWeeksArray(updatedWeekDoc, weeksArray) {
  const index = weeksArray.map(({ document }) => document._id.toString()).indexOf(updatedWeekDoc._id.toString());
  weeksArray[index].document = updatedWeekDoc;
}