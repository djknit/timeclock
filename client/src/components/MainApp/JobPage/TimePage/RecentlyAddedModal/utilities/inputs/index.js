import { timePeriodOptions, periodOptionMsecValues } from './mainOptions';
import {
  customPeriodUnitOptions, getCustomPeriodDurationInMsec, customPeriodUnitValues
} from './custom';

function getTimePeriodInputsStartingValue() {
  return {
    timePeriodChoice: 'day',
    customPeriodNumber: '',
    customPeriodUnit: customPeriodUnitValues.hours,
    wasNumberInputTouched: false
  };
}

function processInputChange(changedPropName, newPropValue) {
  const _processNumInput = _input => (_input || _input === 0) ? parseFloat(_input) : _input;
  const isNumInput = changedPropName === 'customPeriodNumber';
  let completeUpdates = {
    [changedPropName]: isNumInput ? _processNumInput(newPropValue) : newPropValue
  };
  if (isNumInput) completeUpdates.wasNumberInputTouched = true;
  return completeUpdates;
}

function getInputProblems({ timePeriodChoice, customPeriodNumber, wasNumberInputTouched }) {
  let problems = {}, problemMessages = [], hasProblem = false;
  if (timePeriodChoice !== 'custom' || !wasNumberInputTouched) {
    return { problems, problemMessages, hasProblem };
  };
  if (!customPeriodNumber) {
    hasProblem = true;
    problems.customPeriodNumber = true;
  }
  else if (customPeriodNumber < 0) {
    hasProblem = true;
    problems.customPeriodNumber = true;
    problemMessages.push('This input cannot be negative.')
  }
  return { problems, problemMessages, hasProblem };
}

function getPeriodDurationInMsec({ timePeriodChoice, customPeriodNumber, customPeriodUnit }) {
  return timePeriodChoice === 'custom' ? (
    getCustomPeriodDurationInMsec({ customPeriodNumber, customPeriodUnit })
  ) : (
    periodOptionMsecValues[timePeriodChoice]
  );
}

function extractInputValues({
  timePeriodChoice, customPeriodNumber, customPeriodUnit, wasNumberInputTouched
}) {
  return { timePeriodChoice, customPeriodNumber, customPeriodUnit, wasNumberInputTouched };
}

function getReverseProcessedInputValue(propName, inputValues) { // reverse meaning to return value from comp state to form input value
  const value = inputValues[propName];
  return (
    propName === 'customPeriodNumber' ?
    reverseProcessNumberInputValue(value) :
    value
  );
}

function reverseProcessNumberInputValue(numVal) {
  return (numVal || numVal === 0) ? numVal : '';
}

export {
  getTimePeriodInputsStartingValue,
  extractInputValues,
  getInputProblems,
  timePeriodOptions,
  customPeriodUnitOptions,
  getPeriodDurationInMsec,
  processInputChange,
  getReverseProcessedInputValue
};
