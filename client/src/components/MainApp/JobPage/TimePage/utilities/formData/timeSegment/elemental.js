import { currentJobSettingsService } from '../../../../../../../data';
import {
  jobData as jobDataUtils,
  getTimestampFromDateAndTime
} from '../../../../utilities';

const { getDateForTime } = jobDataUtils;

function getSegmentBoundaryDayDatesAndTimestamps(
  { startDate, endDate, startTime, endTime },
  timezone
) {

  const rawSettings = currentJobSettingsService._getRawSchedules();

  const startUtcTime = getTimestampFromDateAndTime(startDate, startTime, timezone);
  const endUtcTime = getTimestampFromDateAndTime(endDate, endTime, timezone);
  
  return {
    firstDay: _getWorkDayDate(startUtcTime, true),
    lastDay: _getWorkDayDate(endUtcTime, false),
    startUtcTime,
    endUtcTime
  };

  function _getWorkDayDate(_timestamp, _isRoundedForward) {
    return getDateForTime(_timestamp, rawSettings, _isRoundedForward);
  }
}

export {
  getSegmentBoundaryDayDatesAndTimestamps,
  currentJobSettingsService
};
