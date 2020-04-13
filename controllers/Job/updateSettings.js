const { Job, } = require('../../models');

const { getJobById } = require('./find');

const { jobNotFoundCheckerFactory, checkForFailure, isDateValid, wageValidation } = require('./utilities');

module.exports = {
  updateWage
};

// *** Probably need to update individual schedule entries to make it easier to know what has changed when determining weeks affected
function updateWage(updates, jobId, userId) {
  return new Promise((resolve, reject) => {
    const { add, changeDate, remove, edit } = updates;
    // check input
    // validate values for add and edit operations
    let job;
    getJobById(jobId, userId)
    .then(_job => {
      job = _job;

      // if dates moved, determine if date moved passed another schedule entry
        // if so, add entries passed to delete list
      // do all removes, then change date, then add; edit can be anytime
      // for remove, change date, and edit: make sure id exists.
      // get affected date range after each operation.
      // determine time range affected
      // run updates to value schedule
      // update weeks and days
    })
    .populate('weeks.document')
    .then(jobNotFoundCheckerFactory(jobId))
    .then(job => updateWagesOfWeeksAndDays())
    .then(resolve)
    .catch(reject);
  });
}

function validateWageUpdatesInput(updates) {
  return new Promise((resolve, reject) => {
    validateUpdatesParentObj(updates);
    const { add, changeDate, remove, edit } = updates;
    validateAddMethod(add)
    .then(() => {
      
    });

  });
}

function updateWagesOfWeeksAndDays(updatedWageSched, job) {
  const oldWageSched = job.wage;

  return new Promise((resolve, reject) => {
    // determine which weeks are affected
      // When an entry is added, updated or deleted, weeks that have days in the time period beginning on the startDate of the entry and ending on the next startDate in the schedule.
      // When the startDate of an entry is changed, the affected time period is between the old and new values including the day of whichever startDate is earlier but not the other
      // If startDate and value are both updated, the affected period begins on whichever the earlier date is between the old and the new startDate and ends on the next startDate in the schedule.
    // make updates
    // ???
    // profit
  });
}

function validateUpdatesParentObj(updates) {
  const methods = ['add', 'changeDate', 'remove', 'edit'];
  let updatesProblems = {};
  let problemMessages = [];
  let hasValidUpdate = false;
  for (let i = 0; i < 4; i++) {
    const method = methods[i];
    if (!updates[method]) updates[method] = [];
    if (typeof(updates[method]) !== 'array') {
      updatesProblems[method] = true;
      problemMessages.push('`updates.' + method + '` must be an array.');
    }
    if (updates[method].length > 0) hasValidUpdate = true; 
  }
  checkForFailure(problemMessages.length > 0, problemMessages, updatesProblems, 400);
  checkForFailure(!hasValidUpdate, 'No valid updates provided.', { updates: true }, 422);
}

function validateAddMethod(additionUpdates) {
  return new Promise((resolve, reject) => {
    const problemsObj = {
      updates: { add: true }
    };
    const failStatus = 422;
    for (let i = 0; i < additionUpdates.length; i++) {
      let newScheduleEntry = additionUpdates[i];
      const { startDate, value } = newScheduleEntry;
      validateStartDate(startDate, 'add', problemsObj);
    }
    wageValidation.validateWages(additionUpdates.map(newSchedEntry => newSchedEntry.value))
    .then(resolve)
    .catch(err => checkForFailure(true, 'Invalid value in `add` update method.', problemsObj, 422));
  });
}

function validateStartDate(startDate, methodName, problemsObj) {
  checkForFailure(
    !startDate || !isDateValid(startDate),
    'Missing or invalid `startDate` in `' + methodName + '` method.',
    problemsObj,
    failStatus
  );
}

function validateWage(wage, methodName, problemsObj) {
  const wageDoc = Wage.create(wage).validate(err => {
    
  })
}