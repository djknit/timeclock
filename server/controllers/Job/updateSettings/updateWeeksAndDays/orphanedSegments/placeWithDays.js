const {
  weeks: weeksController,
  days: daysController
} = require('../../../../timePieces');
const { createAndAddWeekWithDate } = require('../../../addWeek');
const { getDayEndTimeForDate, getDateForTime } = require('../../utilities');

module.exports = placeOrphanedSegmentsWithAdoptiveDays;

function placeOrphanedSegmentsWithAdoptiveDays(orphanedSegments, job, modifiedWeekDocIds, segModMethodName) {
  return new Promise((resolve, reject) => {
    if (orphanedSegments.length === 0) return resolve();
    ensureSegmentsSpanOnlyOneDayEach(orphanedSegments, job, segModMethodName);
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

function ensureSegmentsSpanOnlyOneDayEach(segments, job, segModMethodName) {
  let stillOrphanedSegments = [];
  segments.forEach(segment => {
    ensureSegmentSpansOnlyOneDay(segment, job, stillOrphanedSegments, segModMethodName);
  });
  if (stillOrphanedSegments.length > 0) {
    segments.push(...stillOrphanedSegments);
    ensureSegmentsSpanOnlyOneDayEach(segments, job, segModMethodName);
  }
}

function placeSingleSegmentWithAdoptiveDay(segment, job, modifiedWeekDocIds) {
  return new Promise((resolve, reject) => {
    const date = getDateForTime(segment.startTime, job, true);
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
    createAndAddWeekWithDate(date, job)
    .then(newWeekArrayEntry => {
      placeNewWeekInWeeksArray(job.weeks, newWeekArrayEntry);
      return resolve(weeksController.findWeekWithDate(date, job.weeks));
    });
  });
}

function ensureSegmentSpansOnlyOneDay(segment, job, stillOrphanedSegments, segModMethodName) {
  const { startTime, endTime } = segment;
  const startTimeDate = getDateForTime(startTime, job, true);
  const endTimeDate = getDateForTime(endTime, job, false);
  if (startTimeDate.day !== endTimeDate.day) {
    segment.modified.push({
      time: Date.now(),
      previousValue: { startTime, endTime },
      method: segModMethodName
    });
    const startTimeDateEndTime = getDayEndTimeForDate(startTimeDate, job);
    stillOrphanedSegments.push({
      ...segment,
      startTime: startTimeDateEndTime
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
