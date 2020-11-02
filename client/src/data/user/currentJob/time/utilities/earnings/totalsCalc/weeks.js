import {
  addRateEarningsToTotals,
  findTotalsForCurrencyInTotalsByCurrency
} from './elemental';

export {
  addWeekEarningsTotals
};


function addWeekEarningsTotals(week, totalEarningsByCurrency) {
  const { earnings } = week;
  if (!earnings) return;
  earnings.forEach(earningsForCurrency => {
    addWeekCurrencyEarningsToTotals(earningsForCurrency, totalEarningsByCurrency);
  });
}

function addWeekCurrencyEarningsToTotals(weekEarningsForCurrency, totalEarningsByCurrency) {
  const { currency, totalTime, amount, rates } = weekEarningsForCurrency;

  const jobTotalsForCurrency = (
    findTotalsForCurrencyInTotalsByCurrency(currency, totalEarningsByCurrency)
  );

  jobTotalsForCurrency.totalTimeInMsec += totalTime.durationInMsec;

  if (!currency) return; // unpaid time is counted under currency value of null

  jobTotalsForCurrency.rawAmount += amount.raw;

  rates.forEach(rateInfo => {
    addRateEarningsToTotals(rateInfo, jobTotalsForCurrency)
  });
}
