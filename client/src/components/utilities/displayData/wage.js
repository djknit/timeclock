import React from 'react';

import {
  getCurrencyAmountDisplay, getCurrencyName, getCurrencyMutiplierDisplay
} from '../elemental';

function processWageValueForDisplay(wageValue) {
  console.log('processWageValueForDisplay')
  if (!wageValue) return null;
  const { rate, currency, overtime } = wageValue;
  return {
    rate: addPerHr(getCurrencyAmountDisplay(rate, currency)),
    currency: getCurrencyName(currency),
    overtime: processOvertimeValueForDisplay(overtime, rate, currency)
  };
}

function processOvertimeValueForDisplay(overtimeValue, baseRate, currency) {
  if (!overtimeValue) return null;
  const { rate, rateMultiplier, useMultiplier, cutoff } = overtimeValue;
  const otRateDisplay = addPerHr(getCurrencyAmountDisplay(useMultiplier ? baseRate * rateMultiplier : rate, currency));
  const baseRateDisplay = addPerHr(getCurrencyAmountDisplay(baseRate, currency));
  return {
    type: useMultiplier ? 'multiple of base rate' : 'custom',
    cutoff: processOTCutoffValueForDisplay(cutoff),
    rate: otRateDisplay,
    rateMultiplier,
    useMultiplier,
    detailedRate: (
      useMultiplier ?
      getCurrencyMutiplierDisplay(rateMultiplier, baseRateDisplay, otRateDisplay) :
      otRateDisplay
    )
  };
}

function processOTCutoffValueForDisplay(cutoffValue) {
  const cutoffValueInMinutes = Math.floor((cutoffValue / (60 * 1000)) + .5);
  const processedValue = {
    minutes: cutoffValueInMinutes % 60,
    hours: Math.floor(cutoffValueInMinutes / 60)
  };
  let result = `${processedValue.hours} hr`;
  if (processedValue.minutes) result += ` ${processedValue.minutes} min`;
  return result;
}

function addPerHr(rawText) {
  return <>{rawText} / hr</>;
}

export { processWageValueForDisplay };