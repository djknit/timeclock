import { timePeriodOptions, periodOptionMsecValues } from './mainOptions';
import { customPeriodUnitOptions, getCustomPeriodDurationInMsec} from './custom';

function getTimePeriodInputsStartingValue() {
  return {
    timePeriodChoice: 'day',
    customPeriodNumber: '',
    customPeriodUnit: 'hour'
  };
}

function getInputProblems({ timePeriodChoice, customPeriodNumber }) {
  let problems = {}, problemMessages = {};
  if (timePeriodChoice !== 'custom') return;
  if (isNaN(customPeriodNumber)) {
    problems.customPeriodNumber = true;
  }
  else if (customPeriodNumber < 0) {
    problems.customPeriodNumber = true;
    problemMessages.push('This input cannot be negative.')
  }
  return { problems, problemMessages };
}

function getPeriodDurationInMsec({ timePeriodChoice, customPeriodNumber, customPeriodUnit }) {
  return timePeriodChoice === 'custom' ? (
    getCustomPeriodDurationInMsec({ customPeriodNumber, customPeriodUnit })
  ) : (
    periodOptionMsecValues[timePeriodChoice]
  );
}

export {
  getTimePeriodInputsStartingValue,
  getInputProblems,
  timePeriodOptions,
  customPeriodUnitOptions,
  getPeriodDurationInMsec
};