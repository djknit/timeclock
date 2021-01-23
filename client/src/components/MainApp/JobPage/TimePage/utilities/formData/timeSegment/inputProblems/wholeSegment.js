import {
  dates as dateUtils
} from '../../../../../utilities';
import { getSegmentBoundaryDayDates } from '../elemental';
import { getTimestampFromDateAndTime } from '../../time';

const { getDateTime } = dateUtils;

function getWholeSegmentProblems(inputValues, problemMessages) {
  const { startDate, endDate, startTime, endTime } = inputValues;
  const _probMsg = 'The segment end time must occur after the start time.';
  if (getDateTime(endDate) < getDateTime(startDate)) {
    problemMessages.push(_probMsg);
    return {
      startDate: true,
      endDate: true
    };
  }
  if (getTimestampFromDateAndTime(endDate, endTime) <= getTimestampFromDateAndTime(startDate, startTime)) {
    problemMessages.push(_probMsg);
    return {
      startTime: createTimeProbsObj(startTime),
      endTime: createTimeProbsObj(endTime)
    };
  }
}

function createTimeProbsObj(time) {
  return {
    hour: true,
    minute: true,
    amPm: !(time && time.is24hr) || undefined
  };
}


// need to check if segment overlaps existing segments
function doesSegmentOverlapExistingSegs(inputValues, problemMessages, timezone, job) {
  const segBoundaryDayDates = getSegmentBoundaryDayDates(inputValues, timezone, job);
}

export { getWholeSegmentProblems };
