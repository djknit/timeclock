const { getUtcMoment } = require('../utilities');

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