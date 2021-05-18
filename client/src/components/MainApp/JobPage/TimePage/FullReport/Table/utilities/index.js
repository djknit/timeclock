import React from 'react';
import {
  roundNumToNDecimalDigits,
  XtSp,
  formatTime,
  formatMyDate,
  dates as dateUtils,
  getCurrencyAmountDisplay
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
  { decimalDigits = 3 } = {},
  isSplit
) {
  const roundedDurationHrs = roundNumToNDecimalDigits(durationInHours, decimalDigits);
  const strResult = `${roundedDurationHrs.toFixed(decimalDigits)} h`;
  return isSplit ? strResult.split('.') : strResult;
}

function formatAmountEarnedForReportTable(amountVal, isSplit) {
  return amountVal && getCurrencyAmountDisplay(amountVal.raw, amountVal.currency, false, isSplit);
}

function formatPayRateForReportTable({ amount, /* isOvertime, currency */} = {}, isSplit) {
  if (!amount) return amount;
  const perHr = <>&nbsp;/<XtSp/>h</>;
  let formattedAmount = formatAmountEarnedForReportTable(amount, isSplit);
  if (Array.isArray(formattedAmount)) {
    formattedAmount[1] = <>{formattedAmount[1]}{perHr}</>;
  }
  else {
    formattedAmount = <>{formattedAmount}{perHr}</>;
  }
  return formattedAmount;
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
