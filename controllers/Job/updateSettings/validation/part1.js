const { checkForFailure, isDateValid, wageValidation, getUtcMoment } = require('../../utilities');

module.exports = validateUpdates_part1of2;

function validateUpdates_part1of2(updates, valueSchedule) {
  // return new Promise((resolve, reject) => {
  validateUpdatesParentObj(updates);
  return validateAddMethod(updates.add)
  .then(() => validateChangeDateMethod(updates.changeDate, valueSchedule))
  .then(() => validateRemoveMethod(updates.remove, valueSchedule))
  .then(() => validateEditMethod(updates.edit, valueSchedule))
  .then(validateDateChangeDatesAgainstAdditionDates(updates, valueSchedule));
  // });
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
    let dateTimes = [];
    for (let i = 0; i < additionUpdates.length; i++) {
      validateStartDate(additionUpdates[i].startDate, 'add', problemsObj);
      const startDateTime = getUtcMoment(additionUpdates[i].startDate).valueOf();
      const failMsg = 'Duplicate `startDate`s are not allowed.';
      checkForFailure(dateTimes.indexOf(startDateTime) !== -1, failMsg, problemsObj, 422);
      dateTimes.push(startDateTime);
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
  let dateTimes = [];
  for (let i = 0; i < dateChangeUpdates.length; i++) {
    const { startDate, id } = dateChangeUpdates[i];
    validateStartDate(startDate, 'changeDate', problemsObj);
    const startDateTime = getUtcMoment(startDate).valueOf();
    const failMsg = 'Duplicate `startDate`s are not allowed.';
    checkForFailure(dateTimes.indexOf(startDateTime) !== -1, failMsg, problemsObj, 422);
    dateTimes.push(startDateTime);
    validateScheduleEntryId(id, wageSchedule, 'changeDate', problemsObj);
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

function validateDateChangeDatesAgainstAdditionDates(updates) {
  const problemsObj = {
    updates: {
      changeDate: true,
      add: true
    }
  };
  const additionDateTimes = updates.add.map(({ startDate }) => getUtcMoment(startDate).valueOf());
  for (let i = 0; i < updates.changeDate; i++) {
    const dateTime = getUtcMoment(updates.changeDate[i].startDate).valueOf();
    const failMsg = 'Duplicate `startDates`s are not allowed; `add` and `changeDate` updates must all have unique dates.';
    checkForFailure(additionDateTimes.indexOf(dateTime) !== -1, failMsg, problemsObj, 422);
  }
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