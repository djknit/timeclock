import React from 'react';

import {
  getCurrencyName, getCurrencyMutiplierDisplay
} from '../../../utilities';

function processWageValueForDisplay(wageValue) {
  if (!wageValue) return null;
  const { rate, currency, overtime } = wageValue;
  return {
    rate: addPerHr(rate.display.standard),
    currency: getCurrencyName(currency),
    overtime: processOvertimeValueForDisplay(overtime, rate),
    shortRate: addPerHr(rate.display.short, true)
  };
}

function processOvertimeValueForDisplay(overtimeValue, baseRate) {
  if (!overtimeValue) return null;
  const { rate, rateMultiplier, useMultiplier, cutoff } = overtimeValue;
  const otRateDisplay = addPerHr(rate.display.standard);
  const baseRateDisplay = addPerHr(baseRate.display.standard);
  const cutoffDisplay = processOTCutoffValueForDisplay(cutoff);
  return {
    type: useMultiplier ? 'multiple of base rate' : 'custom',
    cutoff: cutoffDisplay.long,
    rate: otRateDisplay,
    rateMultiplier,
    useMultiplier,
    detailedRate: (
      useMultiplier ?
      getCurrencyMutiplierDisplay(rateMultiplier, baseRateDisplay, otRateDisplay) :
      otRateDisplay
    ),
    shortCutoff: cutoffDisplay.short,
    shortRate: addPerHr(rate.display.short, true)
  };
}

function processOTCutoffValueForDisplay(cutoffValue) {
  const { hours, minutes } = cutoffValue;
  let result = {
    short: `${cutoffValue.hours}h`,
    long: <>{hours}&nbsp;hr</>
  };
  if (minutes) {
    result.short += ` ${minutes}m`;
    result.long = <>{result.long}&ensp;{minutes}&nbsp;min</>
  }
  return result;
}

function addPerHr(rawText, isShort) {
  return isShort ? (
    <>{rawText}/h</>
  ) : (
    <>{rawText} / hr</>
  );
}

function getWageValueSummaryText(wageValue) {
  if (!wageValue) return 'none';
  const { rate, overtime, shortRate } = processWageValueForDisplay(wageValue);
  return overtime ? (
    <>{shortRate} ({'>'}{overtime.shortCutoff}@{overtime.shortRate})</>
  ) : (
    <>{rate}</>
  );
}

export { processWageValueForDisplay, getWageValueSummaryText };