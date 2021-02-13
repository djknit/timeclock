import { constants } from '../../../utilities';

const { minsPerHr, secsPerMin } = constants;

const msecPerHr = minsPerHr * secsPerMin * 1000;
const msecPerDay = 24 * msecPerHr;

let timePeriodOptions = [];
let periodOptionMsecValues = {};

function addOption(name, value, msecValue) {
  timePeriodOptions.push({ name, value });
  periodOptionMsecValues[value] = msecValue;
}

addOption('hour', 'hour', msecPerHr);
addOption('4 hours', 'fourHours', 4 * msecPerHr);
addOption('24 hours', 'day', msecPerDay);
addOption('7 days', 'week', 7 * msecPerDay);
addOption('14 days', 'twoWeeks', 14 * msecPerDay);
addOption('Other', 'custom');

export {
  timePeriodOptions,
  periodOptionMsecValues
};
