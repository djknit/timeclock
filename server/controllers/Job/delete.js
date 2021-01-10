const { Job } = require('../../models');

const WeekController = require('../Week');
const UserController = require('../User');

const { getJobBasicsById } = require('./find');

module.exports = {
  deleteJob
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
      .then(result => resolve(userData));
    }
  );
}
