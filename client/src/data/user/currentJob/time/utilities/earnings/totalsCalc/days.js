import { areWagesEquivalent } from '../../../utilities';

export { addDayEarningsToWeekTotals };


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
