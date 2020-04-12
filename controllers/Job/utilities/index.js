const { getMoment, convertMomentToMyDate } = require('../../../utilities');

module.exports = {
  getMoment,
  convertMomentToMyDate,
  jobNotFoundCheckerFactory
};

function jobNotFoundCheckerFactory(jobId) {
  return function(job) {
    if (!job) {
      let err = new Error(`No job found for job id "${jobId}".`);
      err.status = 422;
      err.problems = { jobId: true };
      throw err;
    }
    else return job;
  }
}