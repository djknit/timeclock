const { getJobById } = require('../find');

const { jobNotFoundCheckerFactory, checkForFailure } = require('./utilities');

const { validateUpdates_part1of2, validateUpdates_part2of2 } = require('./validation');
const processUpdates = require('./processUpdates');
const updateValueSchedule = require('./updateValueSchedule');
const getTimespansAffectedByUpdates = require('./getTimespansAffectedByUpdates');
const updateWeeksAndDays = require('./updateWeeksAndDays');

module.exports = {
  // updateWage,
  updatePropWithName
};

function updatePropWithName(propName, updates, jobId, userId) {
  return new Promise((resolve, reject) => {
    validatePropName(propName);
    let job, affectedTimespans;
    getJobById(jobId, userId)
    .then(jobNotFoundCheckerFactory(jobId))
    .then(_job => {
      job = _job;
    })
    .then(() => validateUpdates_part1of2(updates, job[propName], propName))
    .then(() => {
      affectedTimespans = getTimespansAffectedByUpdates(updates, job[propName]);
      processUpdates(updates, job, propName, affectedTimespans);
      validateUpdates_part2of2(updates);
      updateValueSchedule(updates, job, propName);
      return updateWeeksAndDays(job, affectedTimespans, propName);
    })
    .then(_job => {
      job.weeks = _job.weeks;
      return job.save();
    })
    .then(resolve)
    .catch(reject);
  });
}

function validatePropName(propName) {
  const validPropNames = ['wage', 'timezone', 'dayCutoff', 'weekBegins'];
  const failMsg = 'Invalid property name. Must be `wage`, `timezone`, `dayCutoff`, or `weekBegins`.';
  checkForFailure(validPropNames.indexOf(propName) === -1, failMsg, undefined, 422);
}