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
  findWeekWithDate(date, weeksArray) {
    const dateUtcTime = getUtcMoment(date).valueOf();
    for (let i = 0; i < weeksArray.length; i++) {
      const { firstDateUtcTime, lastDateUtcTime, document } = weeksArray[i];
      if (dateUtcTime >= firstDateUtcTime && dateUtcTime <= lastDateUtcTime) {
        return document;
      }
    }
    return null;
  },
  findWeekWithId: (weekId, job) => new Promise(
    (resolve, reject) => {
      const { weeks } = job;
      for (let i = 0; i < weeks.length; i++) {
        const { document } = weeks[i].data;
        if (document._id === weekId) {
          return resolve(document);
        }
      }
      let err = new Error('No week found with `weekId`.');
      reject(err);
      throw err;
    }
  ),
  findWeeksInDateRange: (firstDateUtcTime, lastDateUtcTime, job) => {
    return job.weeks.map(arrayEntry => arrayEntry.data.document)
    .filter(weekDoc => {
      const weekFirstDateTime = getUtcMoment(weekDoc.firstDate).valueOf();
      const weekLastDateTime = getUtcMoment(weekDoc.lastDate).valueOf();
      return (
        (firstDateUtcTime <= weekFirstDateTime && weekFirstDateTime <= lastDateUtcTime) ||
        (firstDateUtcTime <= weekLastDateTime && weekLastDateTime <= lastDateUtcTime)
      );
    });
  }
}