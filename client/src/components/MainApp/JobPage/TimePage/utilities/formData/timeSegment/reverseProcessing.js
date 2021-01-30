import { convert24hrTimeToAmPm } from '../../../../utilities';
import { getTimeInputStartingValue } from '../time';

function convertSegmentToInputValues({ startTime, endTime } = {}) {
  return startTime ? (
    {
      startDate: startTime.date,
      endDate: endTime.date,
      startTime: convertTimeInfoToInputValue(startTime.time),
      endTime: convertTimeInfoToInputValue(endTime.time)
    }
  ) : (
    {
      startDate: null,
      endDate: null,
      startTime: getTimeInputStartingValue(),
      endTime: getTimeInputStartingValue()
    }
  );
}

function convertTimeInfoToInputValue(timeInfo) {
  const { hour, minute, is24hr, amPm } = convert24hrTimeToAmPm(timeInfo);
  return {
    hour, minute, is24hr, amPm, _naturalAmPm: amPm
  };
}

export { convertSegmentToInputValues };
