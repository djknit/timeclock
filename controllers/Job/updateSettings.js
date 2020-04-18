const { Job, } = require('../../models');

const { getJobById } = require('./find');

const {
  jobNotFoundCheckerFactory, checkForFailure, isDateValid, wageValidation, getUtcMoment
} = require('./utilities');

module.exports = {
  updateWage
};

// *** Probably need to update individual schedule entries to make it easier to know what has changed when determining weeks affected
function updateWage(updates, jobId, userId) {
  return new Promise((resolve, reject) => {
    // check input
    // validate values for add and edit operations
    let job;
    let affectedTimespans = {};
    getJobById(jobId, userId)
    .then(_job => {
      job = _job;
      // if dates moved, determine if date moved passed another schedule entry
        // if so, add entries passed to delete list
      // get affected date ranges
      // do all removes, then change date, then add; edit can be anytime
      // for remove, change date, and edit: make sure id exists.
      // run updates to value schedule
      // update weeks and days
    })
    .then(jobNotFoundCheckerFactory(jobId))
    .then(() => validateWageUpdates(updates, job.wage))
    .then(() => {
      affectedTimespans = getTimespansAffectedByUpdate(updates, job.wage);
    })
    .then(() => markEntriesWithinDateChangeTimespansForRemoval(affectedTimespans.changeDate, job.wage, updates))
    .then(() => updateValueSchedule(updates, job))
    .then(job => updateWagesOfWeeksAndDays())
    .then(resolve)
    .catch(reject);
  });
}

function validateWageUpdates(updates, wageSchedule) {
  return new Promise((resolve, reject) => {
    validateUpdatesParentObj(updates);
    validateAddMethod(updates.add)
    .then(() => validateChangeDateMethod(updates.changeDate, wageSchedule))
    .then(() => validateRemoveMethod(updates.remove, wageSchedule))
    .then(() => validateEditMethod(updates.edit, wageSchedule))
    .catch(reject);
  });
} 

function getTimespansAffectedByUpdate(updates, valueSchedule) {
  let result = {};
  const methods = ['add', 'changeDate', 'remove', 'edit'];
  methods.forEach(method => {
    result[method] = getAffectedTimespansForMethod(method, updates, valueSchedule);
  });
  return result;
}

function getAffectedTimespansForMethod(method, updates, schedule) {
  let timespans = [];
  for (let i = 0; i < updates[method].length; i++) {
    const update = updates[method][i];
    timespans.push(
      method === 'changeDate' ?
      getAffectedTimespanForChangeDateUpdate(update, schedule) :
      getAffectedTimespanForOtherUpdate(update, method, schedule)
    );
  }
  return timespans;
}

function getAffectedTimespanForChangeDateUpdate(update, schedule) {
  const oldDate = findScheduleEntryById(update.id, schedule).startDate;
  const oldDateTime = getUtcMoment(oldDate).valueOf();
  const newDateTime = getUtcMoment(update.startDate).valueOf();
  return (
    oldDateTime < newDateTime ?
    {
      firstDateUtcTime: oldDateTime,
      lastDateUtcTime: newDateTime
    } :
    {
      firstDateUtcTime: newDateTime,
      lastDateUtcTime: oldDateTime
    }
  );
}

function getAffectedTimespanForOtherUpdate(update, method, schedule) {
  const schedEntryStartDate = (
    method === 'add' ?
    update.startDate :
    findScheduleEntryById(update.id, schedule).startDate
  );
  const schedEntryDateTime = getUtcMoment(schedEntryStartDate).valueOf();
  const nextDateTime = getNextDateInScheduleUtcTime(schedule, schedEntryDateTime);
  return {
    firstDateUtcTime: schedEntryDateTime,
    lastDateUtcTime: nextDateTime
  };
}

function getNextDateInScheduleUtcTime(schedule, referenceDateUtcTime) {
  for (let i = 0; i < schedule.length; i++) {
    const entryStartDateTime = getUtcMoment(schedule[i].startDate).valueOf();
    if (entryStartDateTime > referenceDateUtcTime) return entryStartDateTime;
  }
  return null;
}

function markEntriesWithinDateChangeTimespansForRemoval(timespans, schedule, updates) {
  for (let i = 0; i < timespans.length; i++) {

  }
}

function updateValueSchedule(updates, job) {

}

function updateWagesOfWeeksAndDays(updatedWageSched, job) {
  const oldWageSched = job.wage;
  return new Promise((resolve, reject) => {

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
  findScheduleEntryById(id, schedule);
  const failMsg = 'Missing or invalid `id` in `' + methodName + '` method.';
  checkForFailure(true, failMsg, problemsObj, 422);
}

function findScheduleEntryById(id, schedule) {
  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i]._id.toString() === id.toString()) return schedule[i];
  }
  throw new Error('No schedule entry found for id.');
}