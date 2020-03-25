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
              $sort: { startCutoff: 1 }
            }
          }
        },
        { new: true }
      )
      .then(week => resolve(week))
      .catch(determineAddSegmentToDayError);
    }
  ),
  // findByDate: (date, jobId) => new Promise(
  //   (resolve, reject) => {
  //     if (!date || !jobId) {
  //       return reject(new Error('Missing required parameters.'));
  //     }
  //     Job.findById(jobId)
  //     .then(job => {
  //       if (!job) return reject(new Error('Job not found.'));
        
  //     })
  //     .catch(reject);
  //   }
  // )
  
}

function determineCreateWeekError(err) {
  return err;
}

function determineAddSegmentToDayError(err) {
  return err; 
;}