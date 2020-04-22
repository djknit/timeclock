const moment = require('moment');

const weeksController = require('../../time/weeks');
const daysController = require('../../time/days');
const WeekController = require('../../Week');

const { getMostRecentScheduleValueForDate, getPrecedingDate } = require('../utilities');

module.exports = updateWeeksAndDays;

function updateWeeksAndDays(job, affectedTimespans, propName) {
  console.log('\n@-@-@ UPDATE WEEKS AND DAYS ~_~^~_~^~_~')
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
    // (firstDateUtcTime & lastDateUtcTime in array entry; firstDate, lastDate, & weekNumber in weekDoc)
    // * get affected weeks
    // * calculate firstDate, lastDate, & weekNumber for each day in week.
      // * if any of the values don't match, update week values and move days as needed to restore consistency
  // move days between weeks to force compliance w/ new week start and end date times.
    // not sure if previous steps can be conducted in that order; need to experiment
}

function updateOtherPropForWeeksAndDays(job, allAffectedTimespans, propName) {
  console.log('\n@-@-@ UPDATE OTHER PROP FOR WEEKS AND DAYS ~_~^~_~^~_~')
  // either update all days in affected weeks or update affected days.
    // when updating, check to see if segments are bumped off the edge of day.
  return new Promise((resolve, reject) => {
    if (propName !== 'wage') { // (propName === 'dayCutoff' || propName === 'timezone')
      allAffectedTimespans.forEach(adjustTimespanToIncludePrecedingDate);
    }
    const weekAndDayIdsWithUpdatedProps = getAffectedWeekAndDayIdsWithUpdatedProps(
      allAffectedTimespans, job, propName
    );
    if (weekAndDayIdsWithUpdatedProps.length === 0) return resolve(job);
    let numCompleted = 0;
    for (let i = 0; i < weekAndDayIdsWithUpdatedProps.length; i++) {
      const { weekId, days } = weekAndDayIdsWithUpdatedProps[i];
      WeekController.updateJobSettingsForDays(days, weekId)
      .then(updatedWeekDoc => {
        placeUpdatedWeekDocInWeeksArray(updatedWeekDoc, job.weeks);
        if (++numCompleted === weekAndDayIdsWithUpdatedProps.length) {
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
  console.log('\n@-@-@ getAffectedWeekAndDayIdsWithUpdatedProps ~_~^~_~^~_~')
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
  console.log('\n@-@-@ turnDaysIntoDayIdsWithUpdatedProps ~_~^~_~^~_~')
  console.log(days)
  return days.map(
    ({ _id, date }) => ({
      id: _id,
      updates: getUpdatedPropsForDayWithDate(date, propName, propValueSchedule)
    })
  );
}

function getUpdatedPropsForDayWithDate(date, propName, propValueSchedule) {
  console.log('\n@-@-@ getUpdatedPropsForDayWithDate ~_~^~_~^~_~')
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
  const index = weeksArray.map(({ document }) => document._id.toString()).indexOf(updatedWeekDoc._id.toString());
  weeksArray[index].document = updatedWeekDoc;
}