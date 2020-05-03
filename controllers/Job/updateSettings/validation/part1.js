const {
  checkForFailure,
  isDateValid,
  getUtcDateTime,
  findScheduleEntryById,
  validateThatEntryIdsForMethodAreNotOnRemoveList,
  updatesProblemsObjFactory,
  methodNames
} = require('./utilities');

const validateUpdateValues = require('./validateUpdateValues');

module.exports = validateUpdates_part1of2;

function validateUpdates_part1of2(updates, valueSchedule, propName) {
  return new Promise((resolve, reject) => {
    validateUpdatesParentObj(updates);
    validateAddMethod(updates.add, propName)
    .then(() => validateChangeDateMethod(updates.changeDate, valueSchedule))
    .then(() => validateRemoveMethod(updates.remove, valueSchedule))
    .then(() => validateEditMethod(updates.edit, valueSchedule, propName))
    .then(() => validateDateChangeDatesAgainstAdditionDates(updates))
    .then(() => validateThatEntryIdsForMethodAreNotOnRemoveList('changeDate', updates)) // done before processing b/c `changeDate` updates are exempt from automatic removal. Since `edit` updates are not they are checked after updates are processed.
    .then(resolve)
    .catch(reject);
  });
}

// __________________________________________________
// *** FUNCTIONS CALLED IN MAIN FUNCTION ***;

function validateUpdatesParentObj(updates) {
  let updatesProblems = {};
  let problemMessages = [];
  let hasValidUpdate = false;
  for (let i = 0; i < methodNames.length; i++) {
    const method = methodNames[i];
    if (!updates[method]) {
      updates[method] = [];
    }
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
  return new Promise((resolve, reject) => {
    const problemsObj = updatesProblemsObjFactory('add');
    validateStartDates(additionUpdates, 'add', problemsObj);
    validateUpdateValues(additionUpdates, propName)
    .then(resolve)
    .catch(err => checkForFailure(true, 'Invalid value in `add` update method.', problemsObj, 422));
  });
}

function validateChangeDateMethod(dateChangeUpdates, schedule) {
  const problemsObj = updatesProblemsObjFactory('changeDate');
  validateStartDates(dateChangeUpdates, 'changeDate', problemsObj);
  validateScheduleEntryIds(dateChangeUpdates, schedule, 'changeDate', problemsObj);
}

function validateRemoveMethod(removalUpdates, schedule) {
  const problemsObj = updatesProblemsObjFactory('remove');
  validateScheduleEntryIds(removalUpdates, schedule, 'remove', problemsObj);
}

function validateEditMethod(editingUpdates, schedule, propName) {
  return new Promise((resolve, reject) => {
    const problemsObj = updatesProblemsObjFactory('edit');
    validateScheduleEntryIds(editingUpdates, schedule, 'edit', problemsObj);
    validateUpdateValues(editingUpdates, propName)
    .then(resolve)
    .catch(err => checkForFailure(true, 'Invalid value in `edit` update method.', problemsObj, 422))
    .catch(reject);
  });
}

function validateDateChangeDatesAgainstAdditionDates(updates) {
  const problemsObj = updatesProblemsObjFactory(['changeDate', 'add']);
  const additionDateTimes = updates.add.map(({ startDate }) => getUtcDateTime(startDate));
  for (let i = 0; i < updates.changeDate; i++) {
    const dateTime = getUtcDateTime(updates.changeDate[i].startDate);
    const failMsg = 'Duplicate `startDates`s are not allowed; `add` and `changeDate` updates must all have unique dates.';
    checkForFailure(additionDateTimes.indexOf(dateTime) !== -1, failMsg, problemsObj, 422);
  }
}

// __________________________________________________
// *** FUNCTIONS CALLED BY OTHER FUNCTIONS ABOVE (not main function) ***;

function validateStartDates(updates, methodName, problemsObj) {
  const failMsg = 'Missing or invalid `startDate` in `' + methodName + '` method.';
  for (let i = 0; i < updates.length; i++) {
    const date = updates[i].startDate;
    // console.log(date)
    checkForFailure(!date || !isDateValid(date), failMsg, problemsObj, 422);
  }
  validateThatStartDatesAreNotDuplicated(updates, problemsObj);
}

function validateScheduleEntryIds(updates, schedule, methodName, problemsObj) {
  const excludeFirstEntry = methodName !== 'edit';
  const failMsg = 'Missing or invalid `id` in `' + methodName + '` method.';
  for (let i = 0; i < updates.length; i++) {
    const isMissingSchedEntry = !findScheduleEntryById(updates[i].id, schedule, excludeFirstEntry);
    checkForFailure(isMissingSchedEntry, failMsg, problemsObj, 422);
  }
  validateThatIdsAreNotDuplicated(updates, problemsObj);
}

function validateThatStartDatesAreNotDuplicated(updates, problemsObj) {
  let dateTimes = [];
  const failMsg = 'Duplicate `startDate`s are not allowed.';
  for (let i = 0; i < updates.length; i++) {
    const dateTime = getUtcDateTime(updates[i].startDate);
    checkForFailure(dateTimes.indexOf(dateTime) !== -1, failMsg, problemsObj, 422);
    dateTimes.push(dateTime);
  }
}

function validateThatIdsAreNotDuplicated(updates, problemsObj) {
  let previousIds = [];
  const failMsg = 'Duplicate `id`s are not allowed.';
  for (let i = 0; i < updates.length; i++) {
    const id = updates[i].id;
    checkForFailure(previousIds.indexOf(id) !== -1, failMsg, problemsObj, 422);
    previousIds.push(id);
  }
}