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
    const display = (
      numDecimalDigits || numDecimalDigits === 0 ?
      parsedValue.toFixed(numDecimalDigits) :
      parsedValue.toString()
    );
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

export { processCurrencyInputValue, getDecimalDigits };