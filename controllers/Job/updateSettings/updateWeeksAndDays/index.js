const moment = require('moment');

const { updateWeekBeginsForWeeks } = require('./weekBegins');
const { updateOtherPropForWeeksAndDays } = require('./otherProp');

const { methodNames } = require('../utilities');

module.exports = updateWeeksAndDays;

function updateWeeksAndDays(job, affectedTimespans, propName) {
  const allAffectedTimespans = getAllAffectedTimespans(affectedTimespans, propName);
  return (
    propName === 'weekBegins' ?
    updateWeekBeginsForWeeks(job, allAffectedTimespans) :
    updateOtherPropForWeeksAndDays(job, allAffectedTimespans, propName)
  );
}

function getAllAffectedTimespans(affectedTimespans, propName) {
  let allAffectedTimespans = [];
  methodNames.forEach(method => {
    allAffectedTimespans.push(...affectedTimespans[method])
  });
  if (propName === 'dayCutoff' || propName === 'timezone') {
    allAffectedTimespans.forEach(adjustTimespanToIncludeSucceedingDate);
  }
  else if (propName === 'weekBegins') {
    allAffectedTimespans.forEach(expandTimespanByOneWeekOnBothEnds);
  }
  return allAffectedTimespans;
}

function adjustTimespanToIncludeSucceedingDate(timespan) {
  if (!timespan.lastDateUtcTime) return;
  timespan.lastDateUtcTime = moment.utc(timespan.lastDateUtcTime).add(1, 'days').valueOf();
}

function expandTimespanByOneWeekOnBothEnds(timespan) {
  if (timespan.firstDateUtcTime) {
    timespan.firstDateUtcTime = moment.utc(timespan.firstDateUtcTime).subtract(1, 'weeks').valueOf();
  }
  if (timespan.lastDateUtcTime) {
    timespan.lastDateUtcTime = moment.utc(timespan.lastDateUtcTime).add(1, 'weeks').valueOf();
  }
}