const Job = require('../../models/Job');

const moment = require('moment-timezone');

const WeekController = require('../Week');
const UserController = require('../User');
const weeksController = require('../time/weeks');

const { convertMomentToMyDate, getFirstDayOfWeekForDate, getMoment } = require('../../utilities');
const { jobNotFoundCheckerFactory } = require('./utilities');
const { getJobById, getJobBasicsById } = require('./find');

const { create } = require('./create');
const { addWeek } = require('./addWeek');

module.exports = {
  create,
  addWeek,
  getJobById,
  getWeekWithDate,
  deleteJob,
  updateWage
};



function getWeekWithDate(date, job) {
  return new Promise(
    (resolve, reject) => {
      const weekDoc = weeksController.findWeekWithDate(date, job.weeks);
      if (weekDoc) return resolve(weekDoc);
      else {
        weeksController.createWeekArrayEntryByDate(date, job)
        .then(weekArrayEntry => addWeek(weekArrayEntry, job._id))
        .then(result => resolve(weekArrayEntry.document))
        .catch(reject);
      }
    }
  );
}

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