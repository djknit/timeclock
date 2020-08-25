import React from 'react';

import {
  getCurrencyAmountDisplay, getCurrencyName, getCurrencyMutiplierDisplay
} from '../../../utilities';

function processWageValueForDisplay(wageValue) {
  if (!wageValue) return null;
  const { rate, currency, overtime } = wageValue;
  return {
    rate: addPerHr(getCurrencyAmountDisplay(rate, currency)),
    currency: getCurrencyName(currency),
    overtime: processOvertimeValueForDisplay(overtime, rate, currency),
    shortRate: addPerHr(
      getCurrencyAmountDisplay(rate, currency, true),
      true
    )
  };
}

function processOvertimeValueForDisplay(overtimeValue, baseRate, currency) {
  if (!overtimeValue) return null;
  const { rate, rateMultiplier, useMultiplier, cutoff } = overtimeValue;
  const _oTRate = useMultiplier ? baseRate * rateMultiplier : rate
  const otRateDisplay = addPerHr(getCurrencyAmountDisplay(_oTRate, currency));
  const baseRateDisplay = addPerHr(getCurrencyAmountDisplay(baseRate, currency));
  const shortOTRateDisplay = addPerHr(
    getCurrencyAmountDisplay(_oTRate, currency, true),
    true
  );
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
    shortRate: shortOTRateDisplay
  };
}

function processOTCutoffValueForDisplay(cutoffValue) {
  const cutoffValueInMinutes = Math.floor((cutoffValue / (60 * 1000)) + .5);
  const minutes = cutoffValueInMinutes % 60;
  const hours = Math.floor(cutoffValueInMinutes / 60)
  let result = {
    short: `${hours}h`,
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
    <>
      {shortRate} (>{overtime.shortCutoff}@{overtime.shortRate})
    </>
  ) : (
    <>{rate}</>
  );
}

export { processWageValueForDisplay, getWageValueSummaryText };