const {
  areDatesEquivalent, getDateForTime, doTimeSegmentsOverlap
} = require('../../utilities');

module.exports = {
  isSegmentValid,
  doesNewSegOverlapExistingSegs,
  getDateForNewSegment
};

function getDateForNewSegment(segment, job) {
  const { startTime, endTime } = segment;
  const startTimeDate = getDateForTime(startTime, job, true);
  const endTimeDate = getDateForTime(endTime, job, false);
  if (!areDatesEquivalent(startTimeDate, endTimeDate)) {
    let err = new Error('Segment `startTime` and `endTime` do not fall on same date.');
    err.problems = {
      segment: {
        startTime: true,
        endTime: true
      }
    };
    err.status = 422;
    throw err;
  }
  else return startTimeDate;
}

function isSegmentValid(segment) {
  const { startTime, endTime } = segment;
  return (startTime && endTime && startTime < endTime) || false;
}

function doesNewSegOverlapExistingSegs(segments, newSegment) {
  for (let i = 0; i < segments.length; i++) {
    if (doTimeSegmentsOverlap(newSegment, segments[i])) {
      return {
        startTime: true,
        endTime: true
      };
    }
  }
  return false;
}
