const { getJobById } = require('../find');

const { jobNotFoundCheckerFactory } = require('../utilities');

const { validateUpdates_part1of2, validateUpdates_part2of2 } = require('./validation');
const processUpdates = require('./processUpdates');
const updateValueSchedule = require('./updateValueSchedule');
const getTimespansAffectedByUpdate = require('./getTimespansAffectedByUpdate');
const updateWeeksAndDays = require('./updateWeeksAndDays');

module.exports = {
  updateWage
};

function updateWage(updates, jobId, userId) {
  return new Promise((resolve, reject) => {
    let job, affectedTimespans;
    getJobById(jobId, userId)
    .then(jobNotFoundCheckerFactory(jobId))
    .then(_job => {
      job = _job;
    })
    .then(() => validateUpdates_part1of2(updates, job.wage))
    .then(() => {
      affectedTimespans = getTimespansAffectedByUpdate(updates, job.wage);
      processUpdates(updates, job, 'wage', affectedTimespans);
      validateUpdates_part2of2(updates);
      return updateValueSchedule(updates, job);
    })
    .then(job => updateWagesOfWeeksAndDays())
    .then(resolve)
    .catch(reject);
  });
}

