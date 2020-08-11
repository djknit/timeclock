import React from 'react';
// import cc from 'currency-codes';
// import getSymbolFromCurrency from 'currency-symbol-map';

import { getCurrencyAmountDisplayAndRounded, getCurrencyMutiplierDisplay } from '../../elemental';

function processCurrencyInputValue(raw, currencyCode) {
  const parsedValue = parseFloat(raw);
  if (!parsedValue && parsedValue !== 0) {
    return {
      raw,
      display: null,
      rounded: null,
      problem: 'no-value'
    };
  }
  else if (parsedValue < 0) {
    return {
      raw,
      display: 'negative',
      rounded: null,
      problem: 'bad-value'
    };
  }
  else {
    const { rounded, display } = getCurrencyAmountDisplayAndRounded(parsedValue, currencyCode);
    return {
      raw,
      display,
      rounded,
      problem: null
    };
  }
}

function processCurrencyMultiplierInputValue(rawMultiplierValue, wageToMultiply) {
  // Next Line: tests for negative or missing value; fxn was already created and serves purpose but there are a couple unneeded extra calculations as well
  const processedMultiplierValue = processCurrencyInputValue(rawMultiplierValue);
  if (processedMultiplierValue.rounded === null) return processedMultiplierValue;
  const { currency, rate } = wageToMultiply;
  const processedRate = processCurrencyInputValue(rate, currency);
  if (processedRate.rounded === null) {
    return {
      raw: rawMultiplierValue,
      display: null,
      rounded: null,
      problem: 'no-rate'
    };
  }
  const parsedMultiplier = processedMultiplierValue.rounded;
  const multipliedRate = processedRate.rounded * parsedMultiplier;
  const processedMultipliedRate = processCurrencyInputValue(multipliedRate, currency);
  let multiplierDisplayValue = (
    parsedMultiplier.toString().length <= parsedMultiplier.toFixed(5).length ?
    parsedMultiplier :
    `(${parsedMultiplier.toFixed(3)}...)`
  );
  return {
    raw: rawMultiplierValue,
    display: getCurrencyMutiplierDisplay(multiplierDisplayValue, processedRate.display, processedMultipliedRate.display),
    rounded: processedMultipliedRate.rounded,
    problem: null
  };
}

export {
  processCurrencyInputValue,
  processCurrencyMultiplierInputValue,
};