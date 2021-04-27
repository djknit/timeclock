import React from 'react';
import {
  roundNumToNDecimalDigits,
  XtSp,
  formatTime,
  formatMyDate,
  dates as dateUtils
} from '../../utilities';
export * from '../../utilities';

const { areDatesEquivalent } = dateUtils;

export {
  formatDurationForReportTable,
  formatAmountEarnedForReportTable,
  formatPayRateForReportTable,
  formatSegmentTimesForReportTable
};


function formatDurationForReportTable(
  { durationInHours },
  { decimalDigits = 3 } = {}
) {
  const roundedDurationHrs = roundNumToNDecimalDigits(durationInHours, decimalDigits);
  return `${roundedDurationHrs.toFixed(decimalDigits)} h`;
}

function formatAmountEarnedForReportTable(amountVal) {
  return amountVal && amountVal.display.standard;
}

function formatPayRateForReportTable({ amount, /* isOvertime, currency */} = {}) {
  return amount && (
    <>{formatAmountEarnedForReportTable(amount)}&nbsp;/<XtSp/>h</>
  );
}

function formatSegmentTimesForReportTable({ startTime, endTime }, dayDate ) {
  const includeDates = (
    !areDatesEquivalent(startTime.date, dayDate) || !areDatesEquivalent(endTime.date, dayDate)
  );
  return {
    startTime: _formatTime(startTime),
    endTime: _formatTime(endTime)
  };
  function _formatTime(_time) {
    let _formattedTime = { time: formatTime(_time.time, false, true) };
    if (includeDates) {
      _formattedTime.date = formatMyDate(_time.date, 'M/D');
    }
    return _formattedTime;
  }
}
