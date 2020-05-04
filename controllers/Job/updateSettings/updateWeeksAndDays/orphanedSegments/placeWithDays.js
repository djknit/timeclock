const weeksController = require('../../../../time/weeks');
const daysController = require('../../../../time/days');
const segmentsController = require('../../../../time/segments');
const JobController = require('../../../');

const { getDayEndTimeForDate } = require('../../utilities');

module.exports = placeOrphanedSegmentsWithAdoptiveDays;

function placeOrphanedSegmentsWithAdoptiveDays(orphanedSegments, job, modifiedWeekDocIds) {
  return new Promise((resolve, reject) => {
    if (orphanedSegments.length === 0) return resolve();
    ensureSegmentsSpanOnlyOneDayEach(orphanedSegments, job);
    let numCompleted = 0;
    orphanedSegments.forEach(segment => {
      placeSingleSegmentWithAdoptiveDay(segment, job, modifiedWeekDocIds)
      .then(() => {
        if (++numCompleted === orphanedSegments.length) {
          return resolve();
        }
      })
      .catch(reject);
    });
  });
}

function ensureSegmentsSpanOnlyOneDayEach(segments, job) {
  let stillOrphanedSegments = [];
  segments.forEach(segment => ensureSegmentSpansOnlyOneDay(segment, job, stillOrphanedSegments));
  if (stillOrphanedSegments.length > 0) {
    segments.push(...stillOrphanedSegments);
    ensureSegmentsSpanOnlyOneDayEach(segments, job);
  }
}

function placeSingleSegmentWithAdoptiveDay(segment, job, modifiedWeekDocIds) {
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

function placeNewWeekInWeeksArray(weeksArray, newWeekArrayEntry) {
  for (let i = 0; i < weeksArray.length; i++) {
    if (weeksArray[i].firstDateUtcTime > newWeekArrayEntry.firstDateUtcTime) {
      weeksArray.splice(i, 0, newWeekArrayEntry);
      return;
    }
  }
}