import { currentJobSettingsService } from '../../../../../../../data';
import {
  jobData as jobDataUtils,
  dates as dateUtils,
  getTimestampFromDateAndTime
} from '../../../../utilities';

const { getDateForTime } = jobDataUtils;
const { getMoment } = dateUtils;


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

function getNumDaysSpannedBySegment(segInputVals, timezone) {
  const boundaryDayDates = getSegmentBoundaryDayDatesAndTimestamps(segInputVals, timezone);
  const startDayMoment = getMoment(boundaryDayDates.firstDay);
  const endDayMoment = getMoment(boundaryDayDates.lastDay);
  return endDayMoment.diff(startDayMoment, 'days') + 1;
}

const timeSegInputConstants = {
  inputFieldMarginBottom: '0.75rem', // matches Bulma style for `.field:not(:last-child)`
  sectionLabelMarginBottom: '0.5rem' // matches Bulma style for `.label:not(:last-child)`, almost ("em"->"rem") 
};

function isTimeSegmentInputIncomplete({ startDate, endDate, startTime, endTime }) {
  function _isIncomplete(_timeInput) {
    return !_timeInput || isNaN(_timeInput.hour) || isNaN(_timeInput.minute);
  }
  return (
    !startDate || !endDate || _isIncomplete(startTime) || _isIncomplete(endTime)
  );
}

export {
  getSegmentBoundaryDayDatesAndTimestamps,
  currentJobSettingsService,
  getNumDaysSpannedBySegment,
  timeSegInputConstants,
  isTimeSegmentInputIncomplete
};
