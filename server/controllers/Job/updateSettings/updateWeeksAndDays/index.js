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
    allAffectedTimespans.forEach(expandTimespanOnBothEnds);
  }
  return allAffectedTimespans;
}

function adjustTimespanToIncludeSucceedingDate(timespan) {
  if (!timespan.lastDateUtcTime) return;
  timespan.lastDateUtcTime = moment.utc(timespan.lastDateUtcTime).add(1, 'days').valueOf();
}

function expandTimespanOnBothEnds(timespan) {
  // For `weekBegins`. Not sure exactly which days can be affected, so 2 weeks expansion on either side just to be safe.
  if (timespan.firstDateUtcTime) {
    timespan.firstDateUtcTime = moment.utc(timespan.firstDateUtcTime).subtract(2, 'weeks').valueOf();
  }
  if (timespan.lastDateUtcTime) {
    timespan.lastDateUtcTime = moment.utc(timespan.lastDateUtcTime).add(2, 'weeks').valueOf();
  }
}