const Job = require('../../models/Job');

const moment = require('moment-timezone');

const JobController = require('../Job');
const daysController = require('../time/days');

const {
  getMostRecentScheduleValueForDate, convertMomentToMyDate, getMoment, areDatesEquivalent
} = require('../../utilities');

module.exports = {
  getDayAndWeekIdsForNewSegment
};

function getDayAndWeekIdsForNewSegment(segment, job) {
  return new Promise(
    (resolve, reject) => {
      const date = getDateForNewSegment(segment, job);
      let weekId;
      JobController.getWeekWithDate(date, job)
      .then(weekDoc => {
        weekId = weekDoc._id;
        return daysController.findDayForDate(date, weekDoc.days);
      })
      .then(day => {
        return resolve({
          weekId,
          dayId: day._id
        });
      })
      .catch(err => {
        err.problems = {
          segment: {
            startTime: true,
            endTime: true
          }
        };
        return reject(err);
      });
    }
  );
}

function getDateForNewSegment(segment, job) {
  const { startTime, endTime } = segment;
  const startTimeDate = getDateForTime(startTime, job);
  const endTimeDate = getDateForTime(endTime, job);
  if (!areDatesEquivalent(startTimeDate, endTimeDate)) {
    let err = new Error('Segment `startTime` and `endTime` do not fall on same date.');
    err.status = 400;
    throw err;
  }
  else return startTimeDate;
}

function getDateForTime(time, job, isStartTime) {
  let guessMoment;
  let guessDate;
  const guessDayOffsets = [0, 1, -1, 2, -2]
  for (let i = 0; i < guessDayOffsets.length; i++) {
    guessMoment = moment.utc(time).add(guessDayOffsets[i], 'days');
    guessDate = convertMomentToMyDate(guessMoment);
    const precedingDate = convertMomentToMyDate(getMoment(guessDate).subtract(1, 'days'));
    const dayStartCutoff = getMostRecentScheduleValueForDate(precedingDate, job.dayCutoff);
    const dayEndCutoff = getMostRecentScheduleValueForDate(guessDate, job.dayCutoff);
    const guessDateStartTime = getMoment(date, job.timezone).valueOf() + dayStartCutoff;
    const guessDateEndTime = getMoment(date, job.timezone).add(1, 'days').valueOf() + dayEndCutoff;
    const isGuessCorrect = isStartTime ?
      (guessDateStartTime <= time && time < guessDateEndTime) :
      (guessDateStartTime < time && time <= guessDateEndTime);
    if (isGuessCorrect) {
      return guessDate;
    }
  }
  throw new Error('Failed to get date for time.');
}