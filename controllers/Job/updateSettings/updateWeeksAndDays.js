const moment = require('moment');

module.exports = updateWeeksAndDays;

function updateWeeksAndDays(job, affectedTimespans, propName) {
  if (propName === 'dayCutoff' || propName === 'timezone') {
    adjustAffectedTimespansForPropsAffectingDayStartTime(affectedTimespans);
  }
  // get affected weeks
  // if propName === timezone, dayCutoff, or wage
    // either update all days in affected weeks or update affected days.
    // when updating, check to see if segments are bumped off the edge of day.
  // else propName === weekBegins in which case
    // update weeks array entry and Week doc
    // move days between weeks to force compliance w/ new week start and end date times.
      // not sure if previous steps can be conducted in that order; need to experiment
}

function adjustAffectedTimespansForPropsAffectingDayStartTime(affectedTimespans) {
  const methods = ['add', 'changeDate', 'remove', 'edit'];
  methods.forEach(method => {
    affectedTimespans[method] = affectedTimespans[method].map(adjustTimespanToIncludePrecedingDate);
  });
}

function adjustTimespanToIncludePrecedingDate(timespan) {
  timespan.firstDateUtcTime = moment.utc(timespan.firstDateUtcTime).subtract(1, 'days').valueOf();
  return timespan;
}