import { constants } from '../../../utilities';

const { minsPerHr, secsPerMin } = constants;

const msecPerMin = secsPerMin * 1000;
const msecPerHr = minsPerHr * msecPerMin;

const getOption = (name, value) => ({ name, value });

const customPeriodUnitOptions = [
  getOption('minutes', msecPerMin),
  getOption('hours', msecPerHr),
  getOption('days', 24 * msecPerHr)
];

function getCustomPeriodDurationInMsec({ customPeriodNumber, customPeriodUnit }) {
  if (!customPeriodNumber || !customPeriodUnit) return;
  return parseInt(customPeriodNumber) * customPeriodUnit;
}

export {
  customPeriodUnitOptions,
  getCustomPeriodDurationInMsec
};