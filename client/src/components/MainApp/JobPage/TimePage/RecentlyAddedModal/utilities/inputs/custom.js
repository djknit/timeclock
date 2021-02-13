import { constants } from '../../../utilities';

const { minsPerHr, secsPerMin } = constants;

const msecPerMin = secsPerMin * 1000;
const msecPerHr = minsPerHr * msecPerMin;

const customPeriodUnitValues = {
  minutes: msecPerMin,
  hours: msecPerHr,
  days: 24 * msecPerHr
};

const customPeriodUnitOptions = (
  ['minutes', 'hours', 'days']
  .map(name => ({ name, value: customPeriodUnitValues[name] }))
);

function getCustomPeriodDurationInMsec({ customPeriodNumber, customPeriodUnit }) {
  if (!customPeriodNumber || !customPeriodUnit || customPeriodNumber <= 0) return;
  return parseFloat(customPeriodNumber) * customPeriodUnit;
}

export {
  customPeriodUnitOptions,
  customPeriodUnitValues,
  getCustomPeriodDurationInMsec
};