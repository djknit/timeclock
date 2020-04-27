const {
  checkForFailure, isDateValid, getUtcDateTime, findScheduleEntryById, wageValidation, methodNamesFactory
} = require('../../utilities');

module.exports = {
  checkForFailure,
  isDateValid,
  getUtcDateTime,
  findScheduleEntryById,
  wageValidation,
  validateThatEntryIdsForMethodAreNotOnRemoveList,
  updatesProblemsObjFactory,
  methodNamesFactory
};

function validateThatEntryIdsForMethodAreNotOnRemoveList(methodName, updates) {
  const problemsObj = updatesProblemsObjFactory([methodName, 'remove']);
  const methodEntryIds = updates[methodName].map(update => update.id.toString());
  const idsOnRemoveList = updates.remove.map(update => update.id.toString());
  const failMsg = 'Cannot complete `' + methodName + '` update because the entry with specified `id` is marked for removal.';
  for (let i = 0; i < methodEntryIds.length; i++) {
    const hasFailed = idsOnRemoveList.indexOf(methodEntryIds[i]) !== -1;
    checkForFailure(hasFailed, failMsg, problemsObj, 422);
  }
}

function updatesProblemsObjFactory(problemMethodNames) {
  let problemsObj = { updates: {} };
  if (Array.isArray(problemMethodNames)) {
    problemMethodNames.forEach(method => {
      problemsObj.updates[method] = true;
    });
  }
  else {
    problemsObj.updates[problemMethodNames] = true;
  }
  return problemsObj;
}