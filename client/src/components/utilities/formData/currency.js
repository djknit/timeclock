import React from 'react';
import cc from 'currency-codes';

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
    const numDecimalDigits = getDecimalDigits(currencyCode);
    let display = (
      numDecimalDigits || numDecimalDigits === 0 ?
      parsedValue.toFixed(numDecimalDigits) :
      parsedValue.toString()
    );
    const currencySymbol = getCurrencySymbol(currencyCode);
    if (currencySymbol) display = currencySymbol + display;
    return {
      raw,
      display,
      rounded: parseFloat(display),
      problem: null
    };
  }
}

function getDecimalDigits(currencyCode) {
  const currencyData = cc.code(currencyCode);
  return currencyData ? currencyData.digits : null;
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
  const multipliedRate = processedRate.rounded * processedMultiplierValue.rounded;
  const processedMultipliedRate = processCurrencyInputValue(multipliedRate, currency);
  return {
    raw: rawMultiplierValue,
    display: <>{rawMultiplierValue} x {processedRate.display} = {processedMultipliedRate.display}</>,
    rounded: processedMultipliedRate.rounded,
    problem: null
  };
}

function getCurrencySymbol(currencyCode) {
  if (currencyCode === 'USD') return '$';
  else if (currencyCode === 'EUR') return <>&euro;</>;
  else if (currencyCode === 'GBP') return <>&pound;</>;
  else if (currencyCode === 'JPY') return <>&yen;</>;
}

export {
  processCurrencyInputValue,
  getDecimalDigits,
  processCurrencyMultiplierInputValue,
  getCurrencySymbol
};