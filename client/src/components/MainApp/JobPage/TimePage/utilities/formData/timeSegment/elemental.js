import { currentJobSettingsService } from '../../../../../../../data';
import { jobData as jobDataUtils } from '../../../../utilities';
import { getTimestampFromDateAndTime } from '../time';

const { getDateForTime } = jobDataUtils;

function getSegmentBoundaryDayDates(
  { startDate, endDate, startTime, endTime },
  timezone
) {
  
  return {
    firstDay: _getWorkDayDate(startDate, startTime, true),
    lastDay: _getWorkDayDate(endDate, endTime, false)
  };

  function _getWorkDayDate(_date, _time, _isRoundedForward) {
    const _timestamp = getTimestampFromDateAndTime(_date, _time, timezone);
    const _jobSettings = currentJobSettingsService._getRawSchedules();
    return getDateForTime(_timestamp, _jobSettings, _isRoundedForward);
  }
}

export {
  getSegmentBoundaryDayDates
};
