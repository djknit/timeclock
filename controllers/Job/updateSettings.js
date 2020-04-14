const { Job, } = require('../../models');

const { getJobById } = require('./find');

const { jobNotFoundCheckerFactory, checkForFailure, isDateValid, wageValidation } = require('./utilities');

module.exports = {
  updateWage
};

// *** Probably need to update individual schedule entries to make it easier to know what has changed when determining weeks affected
function updateWage(updates, jobId, userId) {
  return new Promise((resolve, reject) => {
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
    .then(jobNotFoundCheckerFactory(jobId))
    .then(() => validateWageUpdates(updates, job.wage))
    .then(job => updateWagesOfWeeksAndDays())
    .then(resolve)
    .catch(reject);
  });
}

function validateWageUpdates(updates, wageSchedule) {
  return new Promise((resolve, reject) => {
    validateUpdatesParentObj(updates);
    const { add, changeDate, remove, edit } = updates;
    validateAddMethod(add)
    .then(() => validateChangeDateMethod(changeDate, wageSchedule))
    .then(() => validateRemoveMethod(remove, wageSchedule))
    .then(() => validateEditMethod(edit, wageSchedule))
    .catch(reject);
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
    for (let i = 0; i < additionUpdates.length; i++) {
      validateStartDate(additionUpdates[i].startDate, 'add', problemsObj);
    }
    wageValidation.validateWages(additionUpdates.map(newSchedEntry => newSchedEntry.value))
    .then(resolve)
    .catch(err => checkForFailure(true, 'Invalid value in `add` update method.', problemsObj, 422));
  });
}

function validateChangeDateMethod(dateChangeUpdates, wageSchedule) {
  const problemsObj = {
    updates: { changeDate: true }
  };
  for (let i = 0; i < dateChangeUpdates.length; i++) {
    const { startDate, id } = dateChangeUpdates[i];
    validateScheduleEntryId(id, wageSchedule, 'changeDate', problemsObj);
    validateStartDate(startDate, 'changeDate', problemsObj);
  }
}

function validateRemoveMethod(removalUpdates, wageSchedule) {
  const problemsObj = {
    updates: { remove: true }
  };
  for (let i = 0; i < removalUpdates.length; i++) {
    validateScheduleEntryId(removalUpdates[i].id, wageSchedule, 'remove', problemsObj);
  }
}

function validateEditMethod(editingUpdates, wageSchedule) {
  return new Promise((resolve, reject) => {
    const problemsObj = {
      updates: { edit: true }
    };
    for (let i = 0; i < editingUpdates.length; i++) {
      validateScheduleEntryId(editingUpdates[i].id, wageSchedule, 'edit', problemsObj);
    }
    wageValidation.validateWages(editingUpdates.map(updatedSchedEntry => updatedSchedEntry.value))
    .then(resolve)
    .catch(err => checkForFailure(true, 'Invalid value in `edit` update method.', problemsObj, 422));
  });
}

function validateStartDate(startDate, methodName, problemsObj) {
  const failMsg = 'Missing or invalid `startDate` in `' + methodName + '` method.';
  checkForFailure(!startDate || !isDateValid(startDate), failMsg, problemsObj, 422);
}

function validateScheduleEntryId(id, schedule, methodName, problemsObj) {
  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i]._id.toString() === id) return;
  }
  const failMsg = 'Missing or invalid `id` in `' + methodName + '` method.';
  checkForFailure(true, failMsg, problemsObj, 422);
}