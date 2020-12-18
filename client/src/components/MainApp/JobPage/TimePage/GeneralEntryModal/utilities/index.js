export * from '../../utilities';
export { inputProblemsGetterFactory } from './inputProblems';

function getTimeInputStartingValue() {
  return {
    is24hr: false,
    amPm: 'am',
    hour: undefined,
    minute: undefined
  };
}

function hasBlankInput({ startDate, endDate, startTime, endTime }) {
  return (
    !startDate || !endDate ||
    !startTime || isTimeInputPartBlank(startTime) ||
    !endTime || isTimeInputPartBlank(endTime)
  );
}

function isTimeInputPartBlank({ hour, minute }) {
  return (
    !(hour || hour === 0) ||
    !(minute || minute === 0)
  );
}

export {
  getTimeInputStartingValue,
  hasBlankInput
};
