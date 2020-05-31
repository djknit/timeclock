const { User } = require('../utilities').models;

module.exports = {
  checkForJobWithName,
  addJob,
  getWithJobBasics,
  removeJob
};

function checkForJobWithName(jobName, userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId)
    .populate('jobs')
    .then(user => {
      if (user.jobs.map(job => job.name).filter(name => name === jobName).length > 0) {
        return reject({
          message: 'You already have a job with that name. You must give each job a unique name.',
          problems: {
            name: true
          },
          status: 422
        });
      }
      resolve();
    });
  });
}

function addJob(jobId, userId) {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(
      userId,
      {
        $push: {
          jobs: jobId
        }
      },
      { new: true }
    )
    .populate('jobs')
    .then(resolve)
    .catch(reject);
  });
}

function getWithJobBasics(userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId)
    .populate('jobs')
    .then(user => {
      return resolve(user);
    })
    .catch(reject);
  });
}

function removeJob(jobId, userId) {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          jobs: jobId
        }
      },
      { new: true }
    )
    .populate({
      path: 'jobs',
      populate: 'weeks.document'
    })
    .then(resolve)
    .catch(reject);
  });
}