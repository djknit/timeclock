import {
  jobData as jobDataUtils,
  dates as dateUtils
} from '../../utilities';
import { getTimestampFromDateAndTime } from './formData';

const { getDateForTime } = jobDataUtils;
const { getMoment } = dateUtils;

// rethink where in this utils folder this file/function should go.

// need to split segment that spans multiple days
  // there is already an input processing file

function getNumDaysSpannedBySegment({ startDate, endDate, startTime, endTime }, timezone, job) {

  function _getDayDateMoment(_date, _time, _isRoundedForward) {
    const _timestamp = getTimestampFromDateAndTime(_date, _time, timezone);
    return getMoment(getDateForTime(_timestamp, job.settings, _isRoundedForward));
  }

  const startDayMoment = _getDayDateMoment(startDate, startTime, true);
  const endDayMoment = _getDayDateMoment(endDate, endTime, false);

  return endDayMoment.diff(startDayMoment, 'days') + 1;
}

export {
  getNumDaysSpannedBySegment
};
