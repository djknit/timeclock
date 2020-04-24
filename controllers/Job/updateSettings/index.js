const { getJobById } = require('../find');

const { jobNotFoundCheckerFactory, checkForFailure } = require('../utilities');

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
  console.log('\n@-@-@ UPDATE PROP WITH NAME ~_~^~_~^~_~')
  return new Promise((resolve, reject) => {
    validatePropName(propName);
    // console.log('## Passed `propName` validation')
    let job, affectedTimespans;
    getJobById(jobId, userId)
    .then(jobNotFoundCheckerFactory(jobId))
    .then(_job => {
      // console.log('$ Job found. $$$')
      // console.log(_job)
      job = _job;
    })
    .then(() => validateUpdates_part1of2(updates, job[propName], propName))
    .then(() => {
      console.log('## passed `updates` validation part 1')
      affectedTimespans = getTimespansAffectedByUpdates(updates, job[propName]);
      // console.log('$ Affected Timespans $$$')
      console.log(affectedTimespans)
      processUpdates(updates, job, propName, affectedTimespans);
      console.log('## processed updates.')
      // console.log('$ updates $$$')
      console.log(updates);
      validateUpdates_part2of2(updates);
      console.log('## passed `updates` validation part 2')
      return updateValueSchedule(updates, job, propName);
    })
    .then(_job => updateWeeksAndDays(_job, affectedTimespans, propName))
    .then(resolve)
    .catch(reject);
  });
}

// function updateWage(updates, jobId, userId) {
//   return new Promise((resolve, reject) => {
//     let job, affectedTimespans;
//     getJobById(jobId, userId)
//     .then(jobNotFoundCheckerFactory(jobId))
//     .then(_job => {
//       job = _job;
//     })
//     .then(() => validateUpdates_part1of2(updates, job.wage))
//     .then(() => {
//       affectedTimespans = getTimespansAffectedByUpdate(updates, job.wage);
//       processUpdates(updates, job, 'wage', affectedTimespans);
//       validateUpdates_part2of2(updates);
//       return updateValueSchedule(updates, job);
//     })
//     .then(job => updateWagesOfWeeksAndDays())
//     .then(resolve)
//     .catch(reject);
//   });
// }

function validatePropName(propName) {
  const validPropNames = ['wage', 'timezone', 'dayCutoff', 'weekBegins'];
  const failMsg = 'Invalid property name. Must be `wage`, `timezone`, `dayCutoff`, or `weekBegins`.';
  checkForFailure(validPropNames.indexOf(propName) === -1, failMsg, undefined, 422);
}