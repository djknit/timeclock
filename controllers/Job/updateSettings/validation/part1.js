const {
  checkForFailure, isDateValid, wageValidation, getUtcDateTime, findScheduleEntryById
} = require('../../utilities');

const validateUpdateValues = require('./validateUpdateValues');

module.exports = validateUpdates_part1of2;

function validateUpdates_part1of2(updates, valueSchedule, propName) {
  console.log('\n@-@-@ VALIDATE UPDATES PART 1 ~_~^~_~^~_~')
  // return new Promise((resolve, reject) => {
  validateUpdatesParentObj(updates);
  return validateAddMethod(updates.add, propName)
  .then(() => validateChangeDateMethod(updates.changeDate, valueSchedule))
  .then(() => validateRemoveMethod(updates.remove, valueSchedule))
  .then(() => validateEditMethod(updates.edit, valueSchedule, propName))
  .then(() => validateDateChangeDatesAgainstAdditionDates(updates));
  // });
}

function validateUpdatesParentObj(updates) {
  console.log('\n@-@-@ VALIDATE PARENT OBJ ~_~^~_~^~_~')
  const methods = ['add', 'changeDate', 'remove', 'edit'];
  let updatesProblems = {};
  let problemMessages = [];
  let hasValidUpdate = false;
  for (let i = 0; i < 4; i++) {
    const method = methods[i];
    if (!updates[method]) updates[method] = [];
    if (!Array.isArray(updates[method])) {
      updatesProblems[method] = true;
      problemMessages.push('`updates.' + method + '` must be an array.');
    }
    if (updates[method].length > 0) hasValidUpdate = true; 
  }
  checkForFailure(problemMessages.length > 0, problemMessages, updatesProblems, 400);
  checkForFailure(!hasValidUpdate, 'No valid updates provided.', { updates: true }, 422);
}

function validateAddMethod(additionUpdates, propName) {
  console.log('\n@-@-@ VALIDATE ADD METHOD ~_~^~_~^~_~')
  return new Promise((resolve, reject) => {
    const problemsObj = {
      updates: { add: true }
    };
    let dateTimes = [];
    for (let i = 0; i < additionUpdates.length; i++) {
      validateStartDate(additionUpdates[i].startDate, 'add', problemsObj);
      const startDateTime = getUtcDateTime(additionUpdates[i].startDate);
      const failMsg = 'Duplicate `startDate`s are not allowed.';
      checkForFailure(dateTimes.indexOf(startDateTime) !== -1, failMsg, problemsObj, 422);
      dateTimes.push(startDateTime);
    }
    validateUpdateValues(additionUpdates, propName)
    .then(resolve)
    .catch(err => checkForFailure(true, 'Invalid value in `add` update method.', problemsObj, 422));
  });
}

function validateChangeDateMethod(dateChangeUpdates, schedule) {
  console.log('\n@-@-@ VALIDATE CHANGE_DATE METHOD ~_~^~_~^~_~')
  const problemsObj = {
    updates: { changeDate: true }
  };
  let dateTimes = [];
  for (let i = 0; i < dateChangeUpdates.length; i++) {
    const { startDate, id } = dateChangeUpdates[i];
    validateStartDate(startDate, 'changeDate', problemsObj);
    const startDateTime = getUtcDateTime(startDate);
    const failMsg = 'Duplicate `startDate`s are not allowed.';
    checkForFailure(dateTimes.indexOf(startDateTime) !== -1, failMsg, problemsObj, 422);
    dateTimes.push(startDateTime);
    validateScheduleEntryId(id, schedule, 'changeDate', problemsObj);
  }
}

function validateRemoveMethod(removalUpdates, schedule) {
  console.log('\n@-@-@ VALIDATE REMOVE METHOD ~_~^~_~^~_~')
  const problemsObj = {
    updates: { remove: true }
  };
  for (let i = 0; i < removalUpdates.length; i++) {
    validateScheduleEntryId(removalUpdates[i].id, schedule, 'remove', problemsObj);
  }
}

function validateEditMethod(editingUpdates, schedule, propName) {
  console.log('\n@-@-@ VALIDATE EDIT METHOD ~_~^~_~^~_~')
    console.log(editingUpdates)
    return new Promise((resolve, reject) => {
    const problemsObj = {
      updates: { edit: true }
    };
    for (let i = 0; i < editingUpdates.length; i++) {
      validateScheduleEntryId(editingUpdates[i].id, schedule, 'edit', problemsObj);
    }
    console.log('ao ao ao')
    console.log(editingUpdates)
    validateUpdateValues(editingUpdates, propName)
    .then(resolve)
    .catch(err => checkForFailure(true, 'Invalid value in `edit` update method.', problemsObj, 422));
  });
}

function validateDateChangeDatesAgainstAdditionDates(updates) {
  console.log('\n@-@-@ VALIDATE CHANGE_DATE DATES v. ADD DATES METHOD ~_~^~_~^~_~')
  const problemsObj = {
    updates: {
      changeDate: true,
      add: true
    }
  };
  const additionDateTimes = updates.add.map(({ startDate }) => getUtcDateTime(startDate));
  for (let i = 0; i < updates.changeDate; i++) {
    const dateTime = getUtcDateTime(updates.changeDate[i].startDate);
    const failMsg = 'Duplicate `startDates`s are not allowed; `add` and `changeDate` updates must all have unique dates.';
    checkForFailure(additionDateTimes.indexOf(dateTime) !== -1, failMsg, problemsObj, 422);
  }
  console.log(' - ___ end of `validateDateChangeDatesAgainstAdditionDates`')
}

function validateStartDate(startDate, methodName, problemsObj) {
  const failMsg = 'Missing or invalid `startDate` in `' + methodName + '` method.';
  checkForFailure(!startDate || !isDateValid(startDate), failMsg, problemsObj, 422);
}

function validateScheduleEntryId(id, schedule, methodName, problemsObj) {
  const excludeFirstEntry = methodName !== 'edit';
  const missingSchedEntry = !findScheduleEntryById(id, schedule, excludeFirstEntry);
  const failMsg = 'Missing or invalid `id` in `' + methodName + '` method.';
  checkForFailure(missingSchedEntry, failMsg, problemsObj, 422);
}