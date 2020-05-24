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

function createAndAddWeekWithDate(date, job, returnWeekArrayEntry) {
  return new Promise((resolve, reject) => {
    let weekArrayEntry;
    weeksController.createWeekArrayEntryByDate(date, job)
    .then(_weekArrayEntry => {
      weekArrayEntry = _weekArrayEntry;
      return addWeek(weekArrayEntry, job._id);
    })
    .then(_job => resolve(returnWeekArrayEntry ? arrayEntry : _job))
    .catch(reject);
  });
}