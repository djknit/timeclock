export * from './inputProblems';

function getTimeInputStartingValue() {
  return {
    is24hr: false,
    amPm: 'am',
    hour: undefined,
    minute: undefined,
    _naturalAmPm: 'am' // remembers preferred value when `amPm` is changed b/c of other input changing
  };
}

export {
  getTimeInputStartingValue
};
