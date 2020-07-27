import { getCurrencyAmountDisplay, getCurrencyName } from '../elemental';

function processWageValueForDisplay(wageValue) {
  console.log('processWageValueForDisplay')
  if (!wageValue) return null;
  const { rate, currency, overtime } = wageValue;
  console.log('heyo')
  getCurrencyName(currency)
  return {
    rate: getCurrencyAmountDisplay(rate, currency),
    currency: getCurrencyName(currency)
  };
}

// function processCurrencyAmountForDisplay(amount, currency) {
//   if (!currency) return amount;

// }

export { processWageValueForDisplay };