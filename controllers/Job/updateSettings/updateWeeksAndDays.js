const moment = require('moment');

const weeksController = require('../../time/weeks');
const daysController = require('../../time/days');
const WeekController = require('../../Week');

const { getMostRecentScheduleValueForDate, getPrecedingDate } = require('../utilities');

module.exports = updateWeeksAndDays;

function updateWeeksAndDays(job, affectedTimespans, propName) {
  if (propName === 'dayCutoff' || propName === 'timezone') {
    adjustAffectedTimespansForPropsAffectingDayStartTime(affectedTimespans);
  }
  const allAffectedTimespans = [
    ...affectedTimespans.add,
    ...affectedTimespans.changeDate,
    ...affectedTimespans.remove,
    ...affectedTimespans.edit
  ];
  return (
    propName === 'weekBegins' ?
    updateWeekBeginsForWeeksAndDays(job, allAffectedTimespans) :
    updateOtherPropForWeeksAndDays(job, allAffectedTimespans, propName)
  );
}

function updateWeekBeginsForWeeksAndDays(job, allAffectedTimespans) {
  // update weeks array entry and Week doc
  // move days between weeks to force compliance w/ new week start and end date times.
    // not sure if previous steps can be conducted in that order; need to experiment
}

function updateOtherPropForWeeksAndDays(job, allAffectedTimespans, propName) {
  // either update all days in affected weeks or update affected days.
    // when updating, check to see if segments are bumped off the edge of day.
  return new Promise((resolve, reject) => {
    if (propName !== 'wage') { // (propName === 'dayCutoff' || propName === 'timezone')
      allAffectedTimespans.forEach(adjustTimespanToIncludePrecedingDate);
    }
    const weekAndDayIdsAndUpdatedProps = getAffectedWeekAndDayIdsWithUpdatedProps(allAffectedTimespans, job, propName);
    let numCompleted = 0;
    for (let i = 0; i < weekAndDayIdsAndUpdatedProps.length; i++) {
      const { weekId, days } = weekAndDayIdsAndUpdatedProps[i];
      WeekController.updateJobSettingsForDays(days, weekId)
      .then(updatedWeekDoc => {
        placeUpdatedWeekDocInWeeksArray(updatedWeekDoc, job.weeks);
        if (++numCompleted === weekAndDayIdsAndUpdatedProps.length) {
          return resolve(job);
        }
      });
    }
  });
}

function adjustTimespanToIncludePrecedingDate(timespan) {
  timespan.firstDateUtcTime = moment.utc(timespan.firstDateUtcTime).subtract(1, 'days').valueOf();
  return timespan;
}

function getAffectedWeekAndDayIdsWithUpdatedProps(timespans, job, propName) {
  return getWeekDocIdsAndDaysInTimespans(timespans, job.weeks)
  .map(({ weekId, days }) => ({
    weekId,
    days: turnDaysIntoDayIdsWithUpdatedProps(days, propName, job[propName])
  }));
}

function getWeekDocIdsAndDaysInTimespans(timespans, weeksArray) {
  const affectedWeeks = weeksController.findWeeksInDateRanges(timespans, weeksArray);
  return affectedWeeks
  .map(weeksArrayEntry => ({
    weekId: weeksArrayEntry.document._id,
    days: daysController.getDaysInDateRanges(timespans, weeksArrayEntry.document.days)
  }));
}

function turnDaysIntoDayIdsWithUpdatedProps(days, propName, propValueSchedule) {
  return days.map(
    ({ _id, date }) => ({
      id: _id,
      updates: getUpdatedPropsForDayWithDate(date, propName, propValueSchedule)
    })
  );
}

function getUpdatedPropsForDayWithDate(date, propName, propValueSchedule) {
  let fieldName_1 = fieldName_2 = 'days.$.';
  if (propName === 'dayCutoff') {
    fieldName_1 += 'endCutoff';
    fieldName_2 += 'startCutoff';
  }
  else {
    fieldName_1 += propName;
    fieldName_2 += 'startTimezone'
  }
  let updatedProps = {
    [fieldName_1]: getMostRecentScheduleValueForDate(date, propValueSchedule)
  };
  if (propName !== 'wage') {
    const precedingDate = getPrecedingDate(date);
    updatedProps[fieldName_2] = getMostRecentScheduleValueForDate(precedingDate, propValueSchedule);
  }
  return updatedProps;
}

function placeUpdatedWeekDocInWeeksArray(updatedWeekDoc, weeksArray) {
  const index = job.weeks.map(({ document }) => document._id.toString()).indexOf(updatedWeekDoc._id.toString());
  weeksArray[index].document = updatedWeekDoc;
}