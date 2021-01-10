const { Job } = require('../../models');

const { jobNotFoundCheckerFactory } = require('./utilities');

module.exports = {
  getJobById,
  getJobBasicsById
};

function getJobById(jobId, userId) {
  return Job.findOne({ _id: jobId, user: userId })
  .populate('weeks.document')
  .then(jobNotFoundCheckerFactory(jobId));
}

function getJobBasicsById(jobId, userId) {
  return Job.findOne({ _id: jobId, user: userId })
  .then(jobNotFoundCheckerFactory(jobId));
}