import { getCurrencyAmountInfo } from '../../utilities';

function getWeekEarnings(fullyProcessedDays) {
  // add earnings from each day
  let totalAmountsEarned = [];
  fullyProcessedDays.forEach(day => {
    const dailyEarnings = day.earnings;
    const indexOfCurrencyInTotals = (
      totalAmountsEarned.map(({ currency }) => currency).indexOf(dailyEarnings.currency)
    );
    if (indexOfCurrencyInTotals !== -1) {
      const currencyTotal = totalAmountsEarned[indexOfCurrencyInTotals];
      currencyTotal.amount = getCurrencyAmountInfo(
        currencyTotal.amount.raw + dailyEarnings.amount.raw
      );
    }
    else {
      const { currency, amount } = dailyEarnings;
      totalAmountsEarned.push({ currency, amount });
    }
  });
  // add times at each unique rate
}

export {
  getWeekEarnings
};