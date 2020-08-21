import {
  dates as dateUtils
} from '../../../utilities';

const { getUtcDateTime } = dateUtils;

function findIndexesOfSchedEntriesBetweenDates(date_1, date_2, schedule) {
  if (schedule.length === 1) return null;
  const dateTime_1 = getUtcDateTime(date_1);
  const dateTime_2 = getUtcDateTime(date_2);
  let indexesOfEntriesBetweenDates = [];
  for (let i = 1; i < schedule.length; i++) {
    const entryDateTime = getUtcDateTime(schedule[i].startDate);
    if (
      (dateTime_1 < entryDateTime && entryDateTime < dateTime_2) ||
      (dateTime_2 < entryDateTime && entryDateTime < dateTime_1)
    ) {
      indexesOfEntriesBetweenDates.push(i);
    }
  }
  return indexesOfEntriesBetweenDates.length > 0 ? indexesOfEntriesBetweenDates : null;
}

function getEntriesInAffectedRangeWarning(oldDate, newDate, schedule, warningMessages, settingDisplayName) {
  const indexesOfEntriesInAffectedRange = findIndexesOfSchedEntriesBetweenDates(oldDate, newDate, schedule);
  if (indexesOfEntriesInAffectedRange) {
    const numAffected = indexesOfEntriesInAffectedRange.length;
    const varText = numAffected > 1 ? (
      ['are', 'values', 'start dates', 'These values']
    ) : (
      ['is', 'value', 'a start date', 'This value']
    );
    warningMessages.push(
      `There ${varText[0]} ${numAffected} ${settingDisplayName.toLowerCase()} ${varText[1]} on the schedule with ${varText[2]} between the current start date and the new start date for the value you are adjusting.`,
      `${varText[3]} will be removed from the schedule when this update is performed.`
    );
    return true;
  }
  return false;
}

export {
  getEntriesInAffectedRangeWarning
};