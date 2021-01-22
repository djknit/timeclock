export * from '../../utilities';
export { inputProblemsGetterFactory } from './inputProblems';
export * from './justAdded';
export * from './formatting';
export * from './inputAutoChanges';

function getTimeInputStartingValue() {
  return {
    is24hr: false,
    amPm: 'am',
    hour: undefined,
    minute: undefined,
    _naturalAmPm: 'am' // remembers preferred value when `amPm` is changed b/c of other input changing
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
