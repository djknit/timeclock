import React from 'react';
import {
  convert24hrTimeToAmPm,
  dates as dateUtils,
  formatMyDate,
  formatTime
} from '../../../utilities';

const { areDatesEquivalent } = dateUtils;

function formatSegmentTimes({ startTime, endTime, date }) {
  const includeDates = !(
    areDatesEquivalent(startTime.date, date) && areDatesEquivalent(endTime.date, date)
  );
  return (
    <>{_formatTime(startTime)} &ndash; {_formatTime(endTime)}</>
  );
  function _formatTime(_startOrEndTime) {
    const _timePart = formatTime(convert24hrTimeToAmPm(_startOrEndTime.time));
    return includeDates ? (
      <>{_timePart}&nbsp;{formatMyDate(_startOrEndTime.date, 'MMM. D')}</>
    ) : (
      _timePart
    );
  }
}


export {
  formatSegmentTimes,
};
