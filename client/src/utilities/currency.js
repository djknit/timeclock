import React from 'react';
import cc from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';

function getCurrencyAmountInfo(rawAmount, currencyCode) {
  if (!rawAmount || !currencyCode) return null;
  const numericDisplay = getCurrencyNumericDisplay(rawAmount, currencyCode);
  const standardDisplay = addCurrencySymbolToNumericDisplay(numericDisplay, currencyCode);
  return {
    raw: rawAmount,
    rounded: parseFloat(numericDisplay),
    display: {
      numeric: numericDisplay,
      short: addCurrencySymbolToNumericDisplay(numericDisplay, currencyCode, true),
      standard: standardDisplay,
      long: <>{standardDisplay}&nbsp;{currencyCode}</>
    }
  };
}

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
    (numDecimalDigits || numDecimalDigits === 0) ?
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

export {
  getCurrencyAmountInfo,
  getCurrencySymbol,
  getCurrencyAmountDisplay,
  getCurrencyAmountDisplayAndRounded,
  getCurrencyName,
};