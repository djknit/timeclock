const Week = require('../models/Week');
const Job = require('../models/Job');

const { getUtcMoment } = require('../utilities');

module.exports = {
  create: (newWeek, jobId, userId) => new Promise(
    (resolve, reject) => {
      const {
        days, firstDate, lastDate, weekNumber, timezone, wage, dayCutoff
      } = newWeek;
      if (
        !days || !firstDate || !lastDate || (!weekNumber && weekNumber !== 0) || !timezone || !wage || (!dayCutoff && dayCutoff !== 0)
      ) {
        const err = new Error('Missing required data properties.');
        reject(err);
        throw(err);
      }
      Week.create({
        data: newWeek,
        job: jobId,
        user: userId
      })
      .then(resolve)
      .catch(err => reject(determineCreateWeekError(err)));
    }
  ),
  getById: (weekId, userId) => {
    return Week.findOne({
      _id: weekId,
      user: userId
    });
  },
  addSegmentToDay: (segment, dayId, weekId, userId) => new Promise(
    (resolve, reject) => {
      // make sure week belongs to user
      // make sure day belongs to week
      // make sure segment falls within day and does not overlap with existing segments
      // add segment to day and return: ? -> week
      // all of the above should be handled by 1 `findOneAndUpdate` call; this is due partially to validation on model.
      Week.findOneAndUpdate(
        {
          _id: weekId,
          user: userId,
          'data.days._id': dayId
        },
        {
          $push: {
            'data.days.$.segments': {
              $each: [segment],
              $sort: { startTime: 1 }
            }
          }
        },
        { new: true }
      )
      .then(resolve)
      .catch(err => reject(determineAddSegmentToDayError(err)));
    }
  ),
  removeSegment: (segmentId, dayId, weekId, userId) => new Promise(
    (resolve, reject) => {
      Week.findOneAndUpdate(
        {
          _id: weekId,
          user: userId,
          'data.days._id': dayId
        },
        {
          $pull: {
            'data.days.$.segments': {
              _id: segmentId
            }
          }
        },
        { new: true }
      )
      .then(resolve)
      .catch(err => reject(determineAddSegmentToDayError(err)));
    }
  ),
  removeAllSegments: () => new Promise(
    (resolve, reject) => {

    }
  ),
  removeSegmentsFromDays: () => new Promise(
    (resolve, reject) => {
      
    }
  )
}

function determineCreateWeekError(err) {
  return err;
}

function determineAddSegmentToDayError(err) {
  return err; 
;}