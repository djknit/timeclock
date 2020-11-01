import { areWagesEquivalent, formatEarningsForCurrency } from './utilities';

function getJobEarnings(processedWeeks) {
  let totalEarningsByCurrency = [];
  processedWeeks.forEach(week => {
    addWeekEarningsTotals(week, totalEarningsByCurrency);
  });
  return totalEarningsByCurrency.map(formatEarningsForCurrency);
}

function addWeekEarningsTotals(week, jobTotalEarningsByCurrency) {
  const { earnings } = week;
  if (!earnings) return;
  earnings.forEach(earningsForCurrency => {
    addWeekCurrencyEarningsToJobTotals(earningsForCurrency, jobTotalEarningsByCurrency);
  });
}

/* USE NEXT FXN TO ADD TOTALS, EARNINGS */
function addWeekCurrencyEarningsToJobTotals(weekEarningsForCurrency, jobTotalEarningsByCurrency) {
  const { currency, totalTime, amount, rates } = weekEarningsForCurrency;

  let jobTotalsForCurrency = (
    jobTotalEarningsByCurrency.filter(_currencyTotals => _currencyTotals.currency === currency)[0]
  );
  if (!jobTotalsForCurrency) {
    jobTotalsForCurrency = {
      currency,
      rawAmount: 0,
      totalTimeInMsec: 0,
      rates: []
    };
    jobTotalEarningsByCurrency.push(jobTotalsForCurrency);
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
  getJobEarnings
};