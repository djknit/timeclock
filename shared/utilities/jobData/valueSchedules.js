const { getDateTime } = require('../dates');

module.exports = {
  getMostRecentScheduleValueForDate,
  getMostRecentScheduleEntryForDate
};

function getMostRecentScheduleValueForDate(date, valueSchedule) {
  return getMostRecentScheduleEntryForDate(date, valueSchedule).value;
}

function getMostRecentScheduleEntryForDate(date, valueSchedule) {
  const index = getMostRecentScheduleIndexForDate(date, valueSchedule);
  if (!index && index !== 0) return null;
  return valueSchedule[index];
}

function getMostRecentScheduleIndexForDate(date, valueSchedule) {
  if (valueSchedule.length === 0) return;
  if (valueSchedule.length === 1) return 0;
  const dateTime = getDateTime(date);
  let selectedIndex = 0;
  for (let i = 1; i < valueSchedule.length; i++) {
    if (getDateTime(valueSchedule[i].startDate) > dateTime) {
      return selectedIndex;
    }
    selectedIndex = i;
  }
  return selectedIndex;
}
