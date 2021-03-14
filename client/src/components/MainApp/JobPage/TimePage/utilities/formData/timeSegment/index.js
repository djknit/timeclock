import { jobData as jobDataUtils } from '../../../../utilities';
import { currentJobSettingsService } from './elemental';
export * from './inputProcessing';
export * from './reverseProcessing';
export * from './bindMethods';
export * from './inputProps';

const { getDateForTime } = jobDataUtils;

function isTimeSegmentInputIncomplete({ startDate, endDate, startTime, endTime }) {
  function _isIncomplete(_timeInput) {
    return !_timeInput || isNaN(_timeInput.hour) || isNaN(_timeInput.minute);
  }
  return (
    !startDate || !endDate || _isIncomplete(startTime) || _isIncomplete(endTime)
  );
}

function getSegmentDate({ startTime, endTime }) { // (timestamps)
  // This fxn does not validate segment. It assumes valid startTime/endTime combo falling on same date.
  const rawSettings = currentJobSettingsService._getRawSchedules();
  return getDateForTime(startTime, rawSettings, true);
}

export {
  isTimeSegmentInputIncomplete,
  getSegmentDate
};
