import React from 'react';
import {
  convert24hrTimeToAmPm,
  dates as dateUtils,
  formatMyDate,
  formatTime
} from '../../../utilities';
export * from './reports';

const { areDatesEquivalent } = dateUtils;

function formatSegmentTimes({ startTime, endTime, date }, includeDates) {
  const _includeDates = (
    includeDates ||
    !areDatesEquivalent(startTime.date, date) ||
    !areDatesEquivalent(endTime.date, date)
  );
  return (
    <>{_formatTime(startTime)}&ensp;&ndash;&ensp;{_formatTime(endTime)}</>
  );
  function _formatTime(_startOrEndTime) {
    const _timePart = formatTime(convert24hrTimeToAmPm(_startOrEndTime.time));
    return _includeDates ? (
      <>{_timePart}&nbsp;{formatMyDate(_startOrEndTime.date, 'MMM. D')}</>
    ) : (
      _timePart
    );
  }
}


export {
  formatSegmentTimes,
};
