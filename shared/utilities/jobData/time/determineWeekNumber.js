const { getMoment } = require('../../dates');

module.exports = determineWeekNumber;

function determineWeekNumber(weekStartDate, referenceDate) {
  const estimate = getMoment(weekStartDate).diff(getMoment(referenceDate), 'weeks') + 1;
  for (let i = estimate - 1; i < estimate + 2; i++) {
    const idealFirstDateOfWeek = getMoment(referenceDate).add(i - 1, 'weeks');
    const weekFirstDateDiffFromIdeal = idealFirstDateOfWeek.diff(getMoment(weekStartDate), 'days');
    if (-4 < weekFirstDateDiffFromIdeal && weekFirstDateDiffFromIdeal < 4) return i;
  }
  throw new Error('Failed to determine week number.');
}
