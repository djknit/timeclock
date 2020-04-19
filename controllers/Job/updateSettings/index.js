const { Job, } = require('../../../models');

const { getJobById } = require('../find');

const {
  jobNotFoundCheckerFactory, checkForFailure, isDateValid, wageValidation, getUtcMoment
} = require('../utilities');

module.exports = {
  updateWage
};

function updateWage(updates, jobId, userId) {
  return new Promise((resolve, reject) => {
    let job;
    let affectedTimespans = {};
    getJobById(jobId, userId)
    .then(_job => {
      job = _job;
    })
    .then(jobNotFoundCheckerFactory(jobId))
    .then(() => validateWageUpdates_part1of2(updates, job.wage))
    .then(() => {
      affectedTimespans = getTimespansAffectedByUpdate(updates, job.wage);
      // for each `changeDate` update, remove all entries with dates between old and new dates
        // note: for this and the next 2 actions, schedule entries that are named in `changeDate` updates are exempt
      markEntriesWithinTimespansForRemoval(affectedTimespans.changeDate, job.wage, updates);
      // for each new entry (`add` method), remove any existing entry w/ the same date
      markEntriesWithStartDatesForRemoval(updates.add.map(update => update.startDate), job.wage, updates);
      // for each `changeDate` update, remove any existing entry w/ the same date as new date
      markEntriesWithStartDatesForRemoval(updates.changeDate.map(update => update.startDate), job.wage, updates);
      removeDuplicatesFromRemoveUpdates(updates);
      validateWageUpdates_part2of2(updates);
      return updateValueSchedule(updates, job);
    })
    .then(job => updateWagesOfWeeksAndDays())
    .then(resolve)
    .catch(reject);
  });
}

function validateWageUpdates_part1of2(updates, wageSchedule) {
  // return new Promise((resolve, reject) => {
    validateUpdatesParentObj(updates);
    return validateAddMethod(updates.add)
    .then(() => validateChangeDateMethod(updates.changeDate, wageSchedule))
    .then(() => validateRemoveMethod(updates.remove, wageSchedule))
    .then(() => validateEditMethod(updates.edit, wageSchedule))
    .then(validateDateChangeDatesAgainstAdditionDates(updates, wageSchedule));
  // });
} 

function validateWageUpdates_part2of2(updates) {
  const problemsObj = {
    updates: { edit: true }
  };
  const removalUpdateIds = updates.remove.map(({ id }) => id);
  for (let i = 0; i < updates.edit; i++) {
    const failMsg = 'Cannot complete `edit` update because the entry with specified `id` is marked for removal.';
    checkForFailure(removalUpdateIds.indexOf(updates.edit[i].id) !== -1, failMsg, problemsObj, 422);
  }
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

function markEntriesWithinTimespansForRemoval(timespans, schedule, updates) {
  const dateChangeUpdateIds = getDateChangeUpdateIds(updates);
  for (let i = 0; i < schedule.length; i++) {
    const { _id, startDate } = schedule[i];
    if (isDateInTimespans(timespans, startDate && dateChangeUpdateIds.indexOf(_id) === -1)) {
      updates.remove.push({ id: schedule[i]._id });
    }
  }
}

function markEntriesWithStartDatesForRemoval(startDates, schedule, updates) {
  const dateChangeUpdateIds = getDateChangeUpdateIds(updates);
  const startDateTimes = startDates.map(date => getUtcMoment(date).valueOf());
  for (let i = 0; i < schedule.length; i++) {
    const { _id, startDate } = schedule[i];
    const entryDateTime = getUtcMoment(startDate).valueOf();
    if (startDateTimes.indexOf(entryDateTime) !== -1 && dateChangeUpdateIds.indexOf(_id) === -1) {
      updates.remove.push({ id: _id });
    }
  }
}

function isDateInTimespans(timespans, date) {
  const dateTime = getUtcMoment(date).valueOf();
  for (let i = 0; i < timespans.length; i++) {
    const { firstDateUtcTime, lastDateUtcTime } = timespans[i];
    if (
      (!firstDateUtcTime || firstDateUtcTime < dateTime) &&
      (!lastDateUtcTime || dateTime < lastDateUtcTime)
    ) return true;
  }
  return false;
}

function getDateChangeUpdateIds(updates) {
  return updates.changeDate.map(({ id }) => id);
}

function removeDuplicatesFromRemoveUpdates(updates) {
  let ids = [];
  let indexesToRemove = [];
  updates.remove.forEach((update, index) => {
    if (ids.indexOf(update.id) !== -1) indexesToRemove.push(index);
    else ids.push(update.id);
  });
  if (indexesToRemove.length > 0) {
    updates.remove = updates.remove.filter((el, index) => indexesToRemove.indexOf(index) === -1);
  }
}

function updateValueSchedule(updates, job) {
  // need to return job w/ updated value schedule
  const jobId = job._id;
  return executeRemoveUpdates(updates.remove, jobId)
  .then(() => executeChangeDateUpdates(updates.changeDate, jobId))
  .then(() => executeEditUpdates(updates.edit, jobId))
  .then(() => executeAddUpdates(updates.add, jobId))
  .then(() => job);
}

function executeRemoveUpdates(removalUpdates, job, propName) {
  return new Promise((resolve, reject) => {
    if (removalUpdates.length === 0) return resolve();
    Job.findByIdAndUpdate(
      job._id,
      {
        $pull: {
          [propName]: {
            _id: {
              $in: removalUpdates.map(update => update.id)
            }
          }
        }
      },
      { new: true }
    )
    .then(_job => {
      job[propName] = _job[propName];
      resolve();
    });
  });
}

function executeChangeDateUpdates(dateChangeUpdates, job, propName) {
  return new Promise((resolve, reject) => {
    if (dateChangeUpdates.length === 0) return resolve();
    const idPropName = propName + '._id';
    const dateFieldName = propName + '.$.startDate';
    const dateTimeFieldName = propName + '.$.startDateUtcTime';
    let numCompleted = 0;
    for (let i = 0; i < dateChangeUpdates.length; i++) {
      const { id, startDate } = dateChangeUpdates[i];
      const startDateUtcTime = getUtcMoment(startDate).valueOf();
      Job.findOneAndUpdate(
        {
          _id: job._id,
          [idPropName]: id
        },
        {
          $set: {
            [dateFieldName]: startDate,
            [dateTimeFieldName]: startDateUtcTime
          }
        },
        { new: true }
      )
      .then(_job => {
        if (++numCompleted === dateChangeUpdates.length) {
          job[propName] = _job[propName];
          resolve();
        }
      });
    }
    
  });
}

function executeEditUpdates(editingUpdates, job, propName) {
  return new Promise((resolve, reject) => {
    if (editingUpdates.length === 0) return resolve();
    const idPropName = propName + '._id';
    const fieldName = propName + '.$.value';
    let numCompleted = 0;
    for (let i = 0; i < editingUpdates.length; i++) {
      const { id, value } = editingUpdates[i];
      Job.findOneAndUpdate(
        {
          _id: job._id,
          [idPropName]: id
        },
        {
          $set: {
            [fieldName]: value
          }
        },
        { new: true }
      )
      .then(_job => {
        if (++numCompleted === editingUpdates.length) {
          job[propName] = _job[propName];
          resolve();
        }
      });
    }
  });
}

function executeAddUpdates(additionUpdates, job, propName) {
  return new Promise((resolve, reject) => {
    if (additionUpdates.length === 0) return resolve();
    additionUpdates = additionUpdates.map(
      ({ startDate, value }) => ({
        startDate,
        value,
        startDateUtcTime: getUtcMoment(startDate).valueOf()
      })
    );
    Job.findByIdAndUpdate(
      job._id,
      {
        $push: {
          [propName] : {
            $each: additionUpdates,
            $sort: { startDateUtcTime: 1 }
          }
        }
      },
      { new: true }
    )
    .then(_job => {
      job[propName] = _job[propName];
      resolve();
    });
  });
}

function updateWagesOfWeeksAndDays(updatedWageSched, job) {
  const oldWageSched = job.wage;
  return new Promise((resolve, reject) => {
    if (dateChangeUpdates.length === 0) return resolve();

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