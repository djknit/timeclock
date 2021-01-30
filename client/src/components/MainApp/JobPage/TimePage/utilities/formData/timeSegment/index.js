export * from './inputProcessing';
export * from './reverseProcessing';
export * from './bindMethods';
export * from './inputProps';

function isTimeSegmentInputIncomplete({ startDate, endDate, startTime, endTime }) {
  function _isIncomplete(_timeInput) {
    return !_timeInput || isNaN(_timeInput.hour) || isNaN(_timeInput.minute);
  }
  return (
    !startDate || !endDate || _isIncomplete(startTime) || _isIncomplete(endTime)
  );
}

export {
  isTimeSegmentInputIncomplete
};
