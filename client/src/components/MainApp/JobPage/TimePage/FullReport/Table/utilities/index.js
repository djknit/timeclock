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

function formatAmountEarnedForReportTable(amountVal, isSplit, showOperator) {
  if (!amountVal) return null;
  let amountDisp = getCurrencyAmountDisplay(amountVal.raw, amountVal.currency, false, isSplit);
  return getAmtDispWithOperator(amountDisp, '=', showOperator);
}

function formatPayRateForReportTable(/* payRate val -> */{ amount } = {}, isSplit, showOperator) {
  if (!amount) return amount;
  const _addPerHr = _val => (<>{_val}&nbsp;/<XtSp/>h</>);
  let formattedAmount = formatAmountEarnedForReportTable(amount, isSplit);
  if (!isSplit) formattedAmount = _addPerHr(formattedAmount);
  else formattedAmount[1] = _addPerHr(formattedAmount[1]);
  return getAmtDispWithOperator(formattedAmount, <>&times;</>, showOperator);
}

function getAmtDispWithOperator(valueDisp, operatorDisp, showOperator) {
  if (!showOperator || !operatorDisp) return valueDisp;
  if (Array.isArray(valueDisp)) valueDisp[0] = <>{operatorDisp}&nbsp;{valueDisp[0]}</>;
  else valueDisp = <>{operatorDisp}&nbsp;{valueDisp}</>;
  return valueDisp;
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
