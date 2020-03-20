const moment = require('moment-timezone');

const { createWeekArrayEntryByDate, createNextWeek } = require('./create');

const {
  getMostRecentScheduleIndexForDate,
  areDatesEquivalent,
  convertMomentToMyDate,
  getUtcMoment,
  getMostRecentScheduleValueForDate
} = require('../../../utilities');

module.exports = {
  createWeekArrayEntryByDate,
  createNextWeek,
  checkForWeekWithDate(date, weeksArray) {
    const dateUtcTime = getUtcMoment(date).valueOf();
    for (let i = 0; i < weeksArray.length; i++) {
      const { firstDateUtcTime, lastDateUtcTime, document } = weeksArray[i];
      if (dateUtcTime >= firstDateUtcTime && dateUtcTime <= lastDateUtcTime) {
        return document;
      }
    }
    return null;
  }
}