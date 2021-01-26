import {
  isPartialWeekInDateRange,
  dates as dateUtils,
  time as timeUtils
} from '../../../../../../utilities';
import { getSegmentBoundaryDayDatesAndTimestamps } from '../../elemental';

const { isDateInRange } = dateUtils;
const { doTimeSegmentsOverlap } = timeUtils;

function doesSegmentOverlapExistingSegs(inputValues, timezone, job, shouldReturnSegs) {
  let segBoundariesInfo = getSegmentBoundaryDayDatesAndTimestamps(inputValues, timezone, job);
  const utilFriendlySegInfo = {
    firstDate: segBoundariesInfo.firstDay,
    lastDate: segBoundariesInfo.lastDay,
    startTime: segBoundariesInfo.startUtcTime,
    endTime: segBoundariesInfo.endUtcTime
  };
  const overlappedSegs = shouldReturnSegs ? [] : null;
  return doesOverlapSegInTimeSections(
    utilFriendlySegInfo, job.time.weeks, doesOverlapSegInWeek, overlappedSegs
  );
}

function doesOverlapSegInWeek(segBoundariesInfo, week, overlappedSegs) {
  if (!isPartialWeekInDateRange(segBoundariesInfo, week)) {
    return overlappedSegs ? undefined : false;
  }
  return doesOverlapSegInTimeSections(
    segBoundariesInfo, week.days, doesOverlapSegInDay, overlappedSegs
  );
}

function doesOverlapSegInDay(segBoundariesInfo, day, overlappedSegs) {
  if (!isDateInRange(segBoundariesInfo, day.date)) {
    return overlappedSegs ? undefined : false;
  }
  function _doesOverlapSeg(newSegInfo, existingSeg,  overlappedSegs) {
    const {
      startTime: { utcTime: startTime },
      endTime: { utcTime: endTime }
    } = existingSeg;
    if (!doTimeSegmentsOverlap(newSegInfo, { startTime, endTime })) {
      return overlappedSegs ? undefined : false;
    }
    if (overlappedSegs) {
      overlappedSegs.push(existingSeg);
    }
    else return true;
  }
  return doesOverlapSegInTimeSections(
    segBoundariesInfo, day.segments, _doesOverlapSeg, overlappedSegs
  );
}

function doesOverlapSegInTimeSections(
  segBoundariesInfo, timeSections, checkIfOverlappedSegExists, overlappedSegs
) {
  for (let i = 0; i < timeSections.length; i++) {
    if (
      checkIfOverlappedSegExists(segBoundariesInfo, timeSections[i], overlappedSegs) &&
      !overlappedSegs
    ) {
      return true;
    }
  }
  return overlappedSegs || false;
}

export {
  doesSegmentOverlapExistingSegs
};
