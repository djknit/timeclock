import { getCurrencyAmountInfo, areWagesEquivalent, getDurationInfo } from '../../../utilities';

function getWeekEarnings(fullyProcessedDays) {
  let weekTotalEarningsByCurrency = [];
  fullyProcessedDays.forEach(day => addDayEarningsToWeekTotals(day, weekTotalEarningsByCurrency));
  console.log(weekTotalEarningsByCurrency)
  return weekTotalEarningsByCurrency.length > 0 ? (
    weekTotalEarningsByCurrency.map(formatEarningsForCurrency)
  ) : (
    null
  );
}

export {
  getWeekEarnings
};


function addDayEarningsToWeekTotals(day, weekTotalsByCurrency) {
  const dayTotalTimeInMsec = day.totalTime.durationInMsec;
  if (!dayTotalTimeInMsec) return;

  const dayWage = day.settings.wage;
  const dayCurrency = dayWage ? dayWage.currency : null;

  let totalsForCurrency = (
    weekTotalsByCurrency.filter(({ currency }) => currency === dayCurrency)[0]
  );
  if (!totalsForCurrency) {
    totalsForCurrency = {
      currency: dayCurrency,
      rawAmount: 0,
      totalTimeInMsec: 0,
      rates: []
    };
    weekTotalsByCurrency.push(totalsForCurrency);
  }

  totalsForCurrency.totalTimeInMsec += dayTotalTimeInMsec;

  if (!day.earnings) return;

  totalsForCurrency.rawAmount += day.earnings.amount.raw;

  day.earnings.rates.forEach(rateInfo => {
    const { rate, duration, isOvertime, amountEarned } = rateInfo;
    let weekTotalsForRate = (
      totalsForCurrency.rates
      .filter(_weekRateTotals => (
        areWagesEquivalent(_weekRateTotals.wage, dayWage) &&
        _weekRateTotals.isOvertime === isOvertime
      ))
      [0]
    );
    if (!weekTotalsForRate) {
      weekTotalsForRate = {
        wage: dayWage,
        rate,
        durationInMsec: 0,
        isOvertime,
        rawAmountEarned: 0
      };
      totalsForCurrency.rates.push(weekTotalsForRate);
    }
    weekTotalsForRate.durationInMsec += duration.durationInMsec;
    weekTotalsForRate.rawAmountEarned += amountEarned.raw;
  });
}

function formatEarningsForCurrency({ currency, rawAmount, totalTimeInMsec, rates }) {
  let result = {
    currency,
    totalTime: getDurationInfo(totalTimeInMsec)
  };
  if (!currency) return result;
  return {
    ...result,
    amount: getCurrencyAmountInfo(rawAmount, currency),
    rates: rates.map(({ rate, durationInMsec, isOvertime, rawAmountEarned, wage }) => (
      {
        rate,
        duration: getDurationInfo(durationInMsec),
        isOvertime,
        amountEarned: getCurrencyAmountInfo(rawAmountEarned, currency),
        wage
      }
    ))
  };
}