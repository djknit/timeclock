const { getUtcDateTime, findScheduleEntryById } = require('../utilities');

module.exports = getTimespansAffectedByUpdates;

function getTimespansAffectedByUpdates(updates, valueSchedule) {
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
  const oldDateTime = getUtcDateTime(oldDate);
  const newDateTime = getUtcDateTime(update.startDate);
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
  const schedEntryDateTime = getUtcDateTime(schedEntryStartDate);
  const nextDateTime = getNextDateInScheduleUtcTime(schedule, schedEntryDateTime);
  console.log({
    firstDateUtcTime: schedEntryDateTime,
    lastDateUtcTime: nextDateTime
  })
  return {
    firstDateUtcTime: schedEntryDateTime,
    lastDateUtcTime: nextDateTime
  };
}

function getNextDateInScheduleUtcTime(schedule, referenceDateUtcTime) {
  for (let i = 0; i < schedule.length; i++) {
    const entryStartDateTime = getUtcDateTime(schedule[i].startDate);
    if (entryStartDateTime > referenceDateUtcTime) return entryStartDateTime;
  }
  return null;
}