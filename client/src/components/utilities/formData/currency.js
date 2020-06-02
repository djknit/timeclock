import React from 'react';
import cc from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';

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
    const numDecimalDigits = getDecimalDigits(currencyCode || '');
    let display = (
      numDecimalDigits || numDecimalDigits === 0 ?
      parsedValue.toFixed(numDecimalDigits) :
      parsedValue.toString()
    );
    const rounded = parseFloat(display);
    const currencySymbol = getCurrencySymbol(currencyCode);
    return {
      raw,
      display: (
        currencySymbol ?
        <>{currencySymbol}&nbsp;{display}</> :
        display
      ),
      rounded,
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
  const parsedMultiplier = processedMultiplierValue.rounded;
  const multipliedRate = processedRate.rounded * parsedMultiplier;
  const processedMultipliedRate = processCurrencyInputValue(multipliedRate, currency);
  let multiplierDisplayValue = (
    parsedMultiplier.toString().length <= parsedMultiplier.toFixed(5).length ?
    parsedMultiplier :
    `(${parsedMultiplier.toFixed(3)}...)`
  );
  // Currency characters from Arabic countries were causing big headache with display reordering seemingly at random due to quirks of text direction. The following mess seems to solve the problem while still preventing line-breaks at undesirable places. Not sure if it's all necessary.
  const noWrapStyle = { whiteSpace: 'nowrap', direction: 'ltr', unicodeBidi: 'isolate' };
  return {
    raw: rawMultiplierValue,
    display: <>
      {multiplierDisplayValue}
      <span style={noWrapStyle}> x {processedRate.display}</span>
      <span> </span>
      <span style={noWrapStyle}><span style={noWrapStyle}>= </span> <span>{processedMultipliedRate.display}</span></span>
    </>,
    rounded: processedMultipliedRate.rounded,
    problem: null
  };
}

function getCurrencySymbol(currencyCode) {
  return getSymbolFromCurrency(currencyCode);
}

export {
  processCurrencyInputValue,
  getDecimalDigits,
  processCurrencyMultiplierInputValue,
  getCurrencySymbol
};