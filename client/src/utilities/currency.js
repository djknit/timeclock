import React from 'react';
import cc from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';
import { XtSp } from './jsxPieces';

function getCurrencyAmountInfo(rawAmount, currencyCode, isSplit) {
  if (!rawAmount || !currencyCode) return null;
  const numericDisplay = getCurrencyNumericDisplay(rawAmount, currencyCode, isSplit);
  const standardDisplay = addCurrencySymbolToNumericDisplay(numericDisplay, currencyCode);
  return {
    raw: rawAmount,
    rounded: parseFloat(numericDisplay),
    display: {
      numeric: numericDisplay,
      short: addCurrencySymbolToNumericDisplay(numericDisplay, currencyCode, true),
      standard: standardDisplay,
      long: <>{standardDisplay}&nbsp;{currencyCode}</>
    },
    currency: currencyCode
  };
}

function getDecimalDigits(currencyCode) {
  const currencyData = cc.code(currencyCode);
  return currencyData ? currencyData.digits : null;
}

function getCurrencySymbol(currencyCode) {
  return getSymbolFromCurrency(currencyCode);
}

function getCurrencyNumericDisplay(amount, currencyCode, isSplit) {
  const numDecimalDigits = getDecimalDigits(currencyCode || '');
  const numAmountStr = amount.toFixed(numDecimalDigits);
  let splitNumStr = numAmountStr.split('.');
  splitNumStr[0] = addCommasToNumberString(splitNumStr[0]);
  return isSplit ? splitNumStr : splitNumStr.join('.');
}

function addCommasToNumberString(numStr) {
  // source: https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators#answer-2901298
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function addCurrencySymbolToNumericDisplay(numericDisplay, currencyCode, isShort) {
  const currencySymbol = getCurrencySymbol(currencyCode);
  if (!currencySymbol) return numericDisplay;
  const preNumContent = <>{currencySymbol}{!isShort && <XtSp />}</>;
  return (
    Array.isArray(numericDisplay) ?
    [<>{preNumContent}{numericDisplay[0]}</>, numericDisplay[1]] :
    <>{preNumContent}{numericDisplay}</>
  );
}

function getCurrencyAmountDisplay(amount, currencyCode, isShort, isSplit) {
  // const numDecimalDigits = getDecimalDigits(currencyCode || '');
  const numericDisplay = getCurrencyNumericDisplay(amount, currencyCode, isSplit);
  return addCurrencySymbolToNumericDisplay(numericDisplay, currencyCode, isShort);
}

function getCurrencyAmountDisplayAndRounded(amount, currencyCode, isSplit) {
  const numericDisplay = getCurrencyNumericDisplay(amount, currencyCode, isSplit);
  return {
    rounded: parseFloat(Array.isArray(numericDisplay) ? numericDisplay.join('.') : numericDisplay),
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