import {
  convert24hrTimeToAmPm, convertAmPmTimeTo24hr, constants
} from '../../utilities';
export * from '../../utilities';

const { minsPerHr } = constants;

function calculateInputValueChange(childPropName, newChildValue, inputValue) {
  if (newChildValue === inputValue[childPropName]) return inputValue;
  if (childPropName === 'is24hr') {
    const newIs24hr = newChildValue && newChildValue !== 'false';
    return (newIs24hr ? convertAmPmTimeTo24hr : convert24hrTimeToAmPm)(inputValue);
  }
  if (childPropName === 'amPm') {
    return {
      ...inputValue,
      amPm: newChildValue,
      _naturalAmPm: newChildValue
    };
  }
  const parsedChildVal = parseInt(newChildValue);
  let amPmUpdates = {};
  if (childPropName === 'hour' && inputValue.is24hr && parsedChildVal >= 0 && parsedChildVal < 24) {
    amPmUpdates.amPm = amPmUpdates._naturalAmPm = parsedChildVal >= 12 ? 'pm' : 'am';
  }
  return {
    ...inputValue,
    [childPropName]: !isNaN(parsedChildVal) ? parsedChildVal : undefined,
    ...amPmUpdates
  };
}

function getCompleteProblems({ problems, value, hasProblem }) {
  let _problems = (
    problems && { ...problems } 
  ) || (
    hasProblem && { hour: true, minute: true }
  ) || (
    {}
  );
  let problemMessages = [];
  const { minute, hour, is24hr } = value;
  const _addInvalidNumberProbs = (isHour, minimum, max) => {
    _problems[isHour ? 'hour' : 'minute'] = true;
    problemMessages.push(
      `Invalid ${isHour} value: can\'t be less than ${minimum} or greater than ${max}.`
    );
  };
  if (is24hr && (hour < 0 || hour > 23)) {
    _problems.hour = true;
    _addInvalidNumberProbs('hour', 0, 23);
  }
  if (!is24hr && (hour < 1 || hour > 12)) {
    _problems.hour = true;
    _addInvalidNumberProbs('hour', 1, 12)
  }
  if (minute < 0 || minute >= minsPerHr) {
    _problems.minute = true;
    _addInvalidNumberProbs('minute', 0, 59);
  }
  return {
    problems: _problems,
    problemMessages
  };
}

export {
  calculateInputValueChange,
  getCompleteProblems
};


function inputProcessorFactory(childPropName) {
  return function (childPropValue) {
    // let _value = { ...value };
    // if (childPropName === 'is24hr' && childPropValue !== value[childPropName]) {
    //   const _newIs24hr = childPropValue && childPropValue !== 'false'; 
    //   const converter = _newIs24hr ? convertAmPmTimeTo24hr : convert24hrTimeToAmPm;
    //   Object.assign(_value, converter(value));
    // }
    // else if (childPropName !== 'amPm') {
    //   _value[childPropName] = (
    //     childPropValue || childPropValue === 0 ?
    //     parseInt(childPropValue) :
    //     undefined
    //   );
    // }
    // else {
    //   _value[childPropName] = childPropValue;
    //   _value._amPmWasAuto = false;
    // }
    // return _value;
  };
}