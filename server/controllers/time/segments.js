const Job = require('../../models/Job');

const moment = require('moment-timezone');

const JobController = require('../Job');
const daysController = require('../time/days');
const weeksController = require('../time/weeks');

const {
  getMostRecentScheduleValueForDate, convertMomentToMyDate, getMoment, areDatesEquivalent
} = require('../../utilities');

module.exports = {
  isSegmentValid,
  doesNewSegOverlapExistingSegs,
  getDateForNewSegment,
  getDateForTime
};

function getDateForNewSegment(segment, job) {
  const { startTime, endTime } = segment;
  const startTimeDate = getDateForTime(startTime, job, true);
  const endTimeDate = getDateForTime(endTime, job);
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

function getDateForTime(time, job, isStartTime) {
  let guessMoment;
  let guessDate;
  const guessDayOffsets = [0, 1, -1, 2, -2];
  for (let i = 0; i < guessDayOffsets.length; i++) {
    guessMoment = moment.utc(time).add(guessDayOffsets[i], 'days');
    guessDate = convertMomentToMyDate(guessMoment);
    const precedingDate = convertMomentToMyDate(getMoment(guessDate).subtract(1, 'days'));
    const dayStartCutoff = getMostRecentScheduleValueForDate(precedingDate, job.dayCutoff);
    const dayEndCutoff = getMostRecentScheduleValueForDate(guessDate, job.dayCutoff);
    const dayStartTimezone = getMostRecentScheduleValueForDate(precedingDate, job.timezone);
    const dayEndTimezone = getMostRecentScheduleValueForDate(guessDate, job.timezone);
    const guessDateStartTime = getMoment(guessDate, dayStartTimezone).valueOf() + dayStartCutoff;
    const guessDateEndTime = getMoment(guessDate, dayEndTimezone).add(1, 'days').valueOf() + dayEndCutoff;
    const isGuessCorrect = isStartTime ?
      (guessDateStartTime <= time && time < guessDateEndTime) :
      (guessDateStartTime < time && time <= guessDateEndTime);
    if (isGuessCorrect) {
      return guessDate;
    }
  }
  throw new Error('Failed to get date for time.');
}

function isSegmentValid(segment) {
  const { startTime, endTime } = segment;
  return (startTime && endTime && startTime < endTime) || false;
}

function doesNewSegOverlapExistingSegs(segments, newSegment) {
  const newSegStartTime = newSegment.startTime;
  const newSegEndTime = newSegment.endTime;
  for (let i = 0; i < segments.length; i++) {
    const { startTime, endTime } = segments[i];
    if (
      (startTime <= newSegStartTime && newSegStartTime < endTime) ||
      (startTime < newSegEndTime && newSegEndTime <= endTime) ||
      (newSegStartTime <= startTime && startTime < newSegEndTime)
    ) {
      return {
        startTime: true,
        endTime: true
      };
    }
  }
  return false;
}