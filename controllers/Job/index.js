const Job = require('../../models/Job');

const moment = require('moment-timezone');

const WeekController = require('../Week');
const UserController = require('../User');
const weeksController = require('../time/weeks');

const { jobNotFoundCheckerFactory } = require('./utilities');
const { getJobById, getJobBasicsById } = require('./find');

const { create } = require('./create');
const { addWeek, createAndAddWeekWithDate } = require('./addWeek');

module.exports = {
  create,
  addWeek,
  getJobById,
  deleteJob,
  updateWage,
  createAndAddWeekWithDate
};

function deleteJob(jobId, userId) {
  return new Promise(
    (resolve, reject) => {
      let userData;
      getJobBasicsById(jobId, userId)
      .then(job => {
        const weekIds = job.weeks.map(ArrayEntry => ArrayEntry.document);
        return WeekController.deleteWeeks(weekIds, userId);
      })
      .then(result => UserController.removeJob(jobId, userId))
      .then(updatedUserData => {
        userData = updatedUserData;
        return Job.deleteOne({
          _id: jobId,
          user: userId
        });
      })
      .then(result => resolve(userData))
      .catch(reject);
    }
  );
}

function updateWage(jobId, updatedWageSchedule, userId) {
  return new Promise((resolve, reject) => {
    // also need to update weeks and days
      // consider update fxn vs. find and manually update
    Job.findOneAndUpdate(
      {
        _id: jobId,
        user: userId
      },
      { $set: { wage: updatedWageSchedule } },
      { new: true }
    )
    .populate('weeks.document')
    .then(jobNotFoundCheckerFactory(jobId))
    .then(resolve)
    .catch(reject);
  });
}