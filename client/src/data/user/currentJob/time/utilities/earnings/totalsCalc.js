import { areWagesEquivalent } from '../../utilities';

function addWeekEarningsTotals(week, totalEarningsByCurrency) {
  const { earnings } = week;
  if (!earnings) return;
  earnings.forEach(earningsForCurrency => {
    addWeekCurrencyEarningsToTotals(earningsForCurrency, totalEarningsByCurrency);
  });
}

/* USE NEXT FXN TO ADD TOTALS, EARNINGS */
function addWeekCurrencyEarningsToTotals(weekEarningsForCurrency, totalEarningsByCurrency) {
  const { currency, totalTime, amount, rates } = weekEarningsForCurrency;

  let jobTotalsForCurrency = (
    totalEarningsByCurrency.filter(_currencyTotals => _currencyTotals.currency === currency)[0]
  );
  if (!jobTotalsForCurrency) {
    jobTotalsForCurrency = {
      currency,
      rawAmount: 0,
      totalTimeInMsec: 0,
      rates: []
    };
    totalEarningsByCurrency.push(jobTotalsForCurrency);
  }

  jobTotalsForCurrency.totalTimeInMsec += totalTime.durationInMsec;

  if (!currency) return; // unpaid time is counted under currency value of null

  jobTotalsForCurrency.rawAmount += amount.raw;

  rates.forEach(rateInfo => {
    const { rate, isOvertime, wage, duration, amountEarned } = rateInfo;
    let jobTotalsForRate = (
      jobTotalsForCurrency.rates
      .filter(_totals => areWagesEquivalent(_totals.wage, wage) && _totals.isOvertime === isOvertime)
      [0]
    );
    if (!jobTotalsForRate) {
      jobTotalsForRate = {
        wage,
        rate,
        isOvertime,
        durationInMsec: 0,
        rawAmountEarned: 0
      };
      jobTotalsForCurrency.rates.push(jobTotalsForRate);
    }
    jobTotalsForRate.durationInMsec += duration.durationInMsec;
    jobTotalsForRate.rawAmountEarned += amountEarned.raw;
  });
}

export {
  addWeekEarningsTotals
};