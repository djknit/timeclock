import React from 'react';
import { roundNumToNDecimalDigits, XtSp } from '../../../utilities';
export * from '../../../utilities';

export {
  formatDurationForReportTable,
  formatAmountEarnedForReportTable,
  formatPayRateForReportTable
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
let i = 0;
function formatPayRateForReportTable({ amount, /* isOvertime, currency */} = {}) {
  return amount && (
    <>{formatAmountEarnedForReportTable(amount)}&nbsp;/<XtSp/>h</>
  );
}
