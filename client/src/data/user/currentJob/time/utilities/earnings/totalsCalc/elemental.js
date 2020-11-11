import { areWagesEquivalent } from '../../wage';

export { addRateEarningsToTotals, findTotalsForCurrencyInTotalsByCurrency };


function addRateEarningsToTotals(rateEarnings, totalsForCurrency) {
  const { rate, isOvertime, wage, duration, amountEarned } = rateEarnings;
    let totalsForRate = (
      totalsForCurrency.rates
      .filter(
        _totals => areWagesEquivalent(_totals.wage, wage) && _totals.isOvertime === isOvertime
      )
      [0]
    );
    if (!totalsForRate) {
      totalsForRate = {
        wage,
        rate,
        isOvertime,
        durationInMsec: 0,
        rawAmountEarned: 0
      };
      totalsForCurrency.rates.push(totalsForRate);
    }
    totalsForRate.durationInMsec += duration.durationInMsec;
    totalsForRate.rawAmountEarned += amountEarned.raw;
}

function findTotalsForCurrencyInTotalsByCurrency(currency, totalsByCurrency) {
  let totalsForCurrency = (
    totalsByCurrency.filter(_currencyTotals => _currencyTotals.currency === currency)[0]
  );
  if (!totalsForCurrency) {
    totalsForCurrency = {
      currency,
      rawAmount: 0,
      totalTimeInMsec: 0,
      rates: []
    };
    totalsByCurrency.push(totalsForCurrency);
  }
  return totalsForCurrency;
}
