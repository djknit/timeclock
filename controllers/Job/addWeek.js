const Job = require('../../models/Job');

const { jobNotFoundCheckerFactory } = require('./utilities');

const weeksController = require('../time/weeks');

module.exports = {
  addWeek,
  createAndAddWeekWithDate
};

function addWeek(week, jobId) {
  return new Promise(
    (resolve, reject) => {
      Job.findByIdAndUpdate(
        jobId,
        {
          $push: {
            weeks: {
              $each: [week],
              $sort: { firstDateUtcTime: 1 }
            }
          }
        },
        { new: true }
      )
      .populate('weeks.document')
      .then(jobNotFoundCheckerFactory(jobId))
      .then(resolve)
      .catch(reject);
    }
  );
}

function createAndAddWeekWithDate(date, job) {
  return new Promise((resolve, reject) => {
    weeksController.createWeekArrayEntryByDate(date, job)
    .then(weekArrayEntry => addWeek(weekArrayEntry, job._id))
    .then(resolve)
    .catch(reject);
  });
}