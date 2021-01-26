import {
  dates as dateUtils,
  getTimestampFromDateAndTime
} from '../../../../../../utilities';
import { doesSegmentOverlapExistingSegs } from './overlap';

const { getDateTime } = dateUtils;

const createTimeProbsObj = (time) => ({
  hour: true,
  minute: true,
  amPm: !(time && time.is24hr) || undefined
});

function getWholeSegmentProblems(inputValues, problemMessages, job) {
  console.log('get whole seg probs')
  const timezone = job.time.sessionTimezone;
  const startEndCompatibilityProbs = getSegStartEndCompatibilityProbs(inputValues, timezone);
  if (startEndCompatibilityProbs) {
    problemMessages.push('The segment end time must occur after the start time.');
    return startEndCompatibilityProbs;
  }
  if (doesSegmentOverlapExistingSegs(inputValues, timezone, job, false)) {
    problemMessages.push(
      'This time segment can\'t be added because it overlaps with one or more existing time segment(s).'
    );
    return {
      startDate: true,
      endDate: true,
      startTime: createTimeProbsObj(inputValues.startTime),
      endTime: createTimeProbsObj(inputValues.endTime)
    };
  }
}

function getSegStartEndCompatibilityProbs(inputValues, timezone) {
  const { startDate, endDate, startTime, endTime } = inputValues;
  if (getDateTime(endDate) < getDateTime(startDate)) {
    return {
      startDate: true,
      endDate: true
    };
  }
  const _getTimestamp = (_date, _time) => getTimestampFromDateAndTime(_date, _time, timezone);
  if (_getTimestamp(endDate, endTime) <= _getTimestamp(startDate, startTime)) {
    return {
      startTime: createTimeProbsObj(startTime),
      endTime: createTimeProbsObj(endTime)
    };
  }
}

export { getWholeSegmentProblems };
