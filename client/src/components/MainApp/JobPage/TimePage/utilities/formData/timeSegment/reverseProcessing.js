import { convert24hrTimeToAmPm } from '../../../../utilities';
import { getTimeInputStartingValue } from '../time';

function convertSegmentToInputValues(segment) {
  if (!segment || !segment.startTime) {
    return {
      startDate: null,
      endDate: null,
      startTime: getTimeInputStartingValue(),
      endTime: getTimeInputStartingValue()
    };
  }
  const { startTime, endTime } = segment;
  return {
    startDate: startTime.date,
    endDate: endTime.date,
    startTime: convertTimeInfoToInputValue(startTime.time),
    endTime: convertTimeInfoToInputValue(endTime.time)
  };
}

function convertTimeInfoToInputValue(timeInfo) {
  const { hour, minute, is24hr, amPm } = convert24hrTimeToAmPm(timeInfo);
  return {
    hour, minute, is24hr, amPm, _naturalAmPm: amPm
  };
}

export { convertSegmentToInputValues };
