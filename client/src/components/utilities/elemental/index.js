/* ABOUT THIS FILE/FOLDER:
  This folder ('elemental') is for functions that are used in BOTH the form data processing ('../formData') and saved data processing ('../displayData')
*/

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

function addCurrencySymbolToNumericDisplay(numericDisplay, currencyCode) {
  const currencySymbol = getCurrencySymbol(currencyCode);
  return (
    currencySymbol ?
    <>{currencySymbol}&nbsp;{numericDisplay}</> :
    numericDisplay
  );
};

function getCurrencyAmountDisplay(amount, currencyCode) {
  // const numDecimalDigits = getDecimalDigits(currencyCode || '');
  const numericDisplay = getCurrencyNumericDisplay(amount, currencyCode);
  return addCurrencySymbolToNumericDisplay(numericDisplay, currencyCode);
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
  getCurrencySymbol,
  // getCurrencyNumericDisplay,
  getCurrencyAmountDisplay,
  getCurrencyAmountDisplayAndRounded,
  getCurrencyName
};