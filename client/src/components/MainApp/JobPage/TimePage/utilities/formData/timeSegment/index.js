import { dates as dateUtils } from '../../../utilities';
import { getSegmentBoundaryDayDatesAndTimestamps } from './elemental';
export * from './inputProcessing';
export * from './autoInputChanges.js';
export * from './inputProblems';
export * from './reverseProcessing';

const { getMoment } = dateUtils;

function getNumDaysSpannedBySegment(segInputVals, timezone) {
  const boundaryDayDates = getSegmentBoundaryDayDatesAndTimestamps(segInputVals, timezone);
  const startDayMoment = getMoment(boundaryDayDates.firstDay);
  const endDayMoment = getMoment(boundaryDayDates.lastDay);
  return endDayMoment.diff(startDayMoment, 'days') + 1;
}

function isTimeSegmentInputIncomplete({ startDate, endDate, startTime, endTime }) {
  function _isIncomplete(_timeInput) {
    return !_timeInput || isNaN(_timeInput.hour) || isNaN(_timeInput.minute);
  }
  return (
    !startDate || !endDate || _isIncomplete(startTime) || _isIncomplete(endTime)
  );
}

export {
  getNumDaysSpannedBySegment,
  isTimeSegmentInputIncomplete
};
