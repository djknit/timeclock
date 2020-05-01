const { Job, } = require('../../../models');

const { getUtcDateTime, findScheduleIndexByEntryId } = require('./utilities');

module.exports = updateValueSchedule;

function updateValueSchedule(updates, job, propName) {
  return new Promise((resolve, reject) => {
    const schedule = job[propName];
    performRemoveUpdates(updates.remove, schedule);
    performChangeDateUpdates(updates.changeDate, schedule);
    performEditUpdates(updates.edit, schedule);
    performAddUpdates(updates.add, schedule);
    sortScheduleChronologically(schedule);
    job.save()
    .then(_job => {
      job[propName] = _job[propName];
      resolve(_job);
    })
    .catch(reject);
  });
}

function performRemoveUpdates(removalUpdates, schedule) {
  removalUpdates.forEach(update => {
    const entryIndex = findScheduleIndexByEntryId(update.id, schedule, true, true);
    schedule.splice(entryIndex, 1);
  });
}

function performChangeDateUpdates(dateChangeUpdates, schedule) {
  dateChangeUpdates.forEach(update => {
    const entryIndex = findScheduleIndexByEntryId(update.id, schedule, true, true);
    schedule[entryIndex].startDate = update.startDate;
    schedule[entryIndex].startDateUtcTime = getUtcDateTime(update.startDate);
  });
}

function performEditUpdates(editingUpdates, schedule) {
  editingUpdates.forEach(update => {
    const entryIndex = findScheduleIndexByEntryId(update.id, schedule, false, true);
    schedule[entryIndex].value = update.value;
  });
}

function performAddUpdates(additionUpdates, schedule) {
  const newEntries = additionUpdates.map(
    ({ startDate, value }) => ({
      startDate,
      value,  
      startDateUtcTime: getUtcDateTime(startDate)
    })
  );
  schedule.push(...newEntries);
}

function sortScheduleChronologically(schedule) {
  schedule.sort(
    (el_1, el_2) => {
      const dateTime_1 = el_1.startDateUtcTime;
      const dateTime_2 = el_2.startDateUtcTime;
      if (!dateTime_1) return -1;
      if (!dateTime_2) return 1;
      return dateTime_1 - dateTime_2;
    }
  );
}