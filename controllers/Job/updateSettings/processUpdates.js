const { getUtcMoment } = require('../utilities');

module.exports = processUpdates;

function processUpdates(updates, job, propName, affectedTimespans) {
  // for each `changeDate` update, remove all entries with dates between old and new dates
    // note: for this and the next 2 actions, schedule entries that are named in `changeDate` updates are exempt
  markEntriesWithinTimespansForRemoval(affectedTimespans.changeDate, job[propName], updates);
  // for each new entry (`add` method), remove any existing entry w/ the same date
  markEntriesWithStartDatesForRemoval(updates.add.map(update => update.startDate), job[propName], updates);
  // for each `changeDate` update, remove any existing entry w/ the same date as new date
  markEntriesWithStartDatesForRemoval(updates.changeDate.map(update => update.startDate), job[propName], updates);
  removeDuplicatesFromRemoveUpdates(updates);
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