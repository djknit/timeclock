import React from 'react';
import cc from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';

function getDecimalDigits(currencyCode) {
  const currencyData = cc.code(currencyCode);
  return currencyData ? currencyData.digits : null;
}

function getCurrencySymbol(currencyCode) {
  return getSymbolFromCurrency(currencyCode);
}

function getCurrencyNumericDisplay(amount, currencyCode) {
  const numDecimalDigits = getDecimalDigits(currencyCode || '');
  return (
    numDecimalDigits || numDecimalDigits === 0 ?
    amount.toFixed(numDecimalDigits) :
    amount.toString()
  );
}

function addCurrencySymbolToNumericDisplay(numericDisplay, currencyCode, isShort) {
  const currencySymbol = getCurrencySymbol(currencyCode);
  return (
    currencySymbol ?
    <>{currencySymbol}{!isShort && <>&nbsp;</>}{numericDisplay}</> :
    numericDisplay
  );
};

function getCurrencyAmountDisplay(amount, currencyCode, isShort) {
  // const numDecimalDigits = getDecimalDigits(currencyCode || '');
  const numericDisplay = getCurrencyNumericDisplay(amount, currencyCode);
  return addCurrencySymbolToNumericDisplay(numericDisplay, currencyCode, isShort);
}

function getCurrencyAmountDisplayAndRounded(amount, currencyCode) {
  const numericDisplay = getCurrencyNumericDisplay(amount, currencyCode);
  return {
    rounded: parseFloat(numericDisplay),
    display: addCurrencySymbolToNumericDisplay(numericDisplay, currencyCode)
  };
}

function getCurrencyName(currencyCode) {
  const currencyData = cc.code(currencyCode || '');
  return currencyData && `${currencyData.currency} (${currencyCode})`;
}

function getCurrencyMutiplierDisplay(multiplierDisplayValue, baseRateDisplayValue, multipliedRateDisplayValue) {
  // Currency characters from Arabic countries were causing big headache with display reordering seemingly at random due to quirks of text direction. The following mess seems to solve the problem while still preventing line-breaks at undesirable places. Not sure if it's all necessary.
  const noWrapStyle = { whiteSpace: 'nowrap', direction: 'ltr', unicodeBidi: 'isolate' };
  return (
    <>
      {multiplierDisplayValue}
      <span style={noWrapStyle}> x {baseRateDisplayValue}</span>
      <span> </span>
      <span style={noWrapStyle}><span style={noWrapStyle}>= </span> <span>{multipliedRateDisplayValue}</span></span>
    </>
  );
}

export {
  getCurrencySymbol,
  // getCurrencyNumericDisplay,
  getCurrencyAmountDisplay,
  getCurrencyAmountDisplayAndRounded,
  getCurrencyName,
  getCurrencyMutiplierDisplay
};