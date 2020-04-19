const { getJobById } = require('../find');

const { jobNotFoundCheckerFactory } = require('../utilities');

const { validateUpdates_part1of2, validateUpdates_part2of2 } = require('./validation');
const processUpdates = require('./processUpdates');
const updateValueSchedule = require('./updateValueSchedule');
const getTimespansAffectedByUpdate = require('./getTimespansAffectedByUpdate');

module.exports = {
  updateWage
};

function updateWage(updates, jobId, userId) {
  return new Promise((resolve, reject) => {
    let job, affectedTimespans;
    getJobById(jobId, userId)
    .then(_job => {
      job = _job;
    })
    .then(jobNotFoundCheckerFactory(jobId))
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

function updateWagesOfWeeksAndDays(updatedWageSched, job) {
  const oldWageSched = job.wage;
  return new Promise((resolve, reject) => {
    if (dateChangeUpdates.length === 0) return resolve();

  });
}

