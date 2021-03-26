import { addRateEarningsToTotals, findTotalsForCurrencyInTotalsByCurrency } from './elemental';

export { addDayEarningsToWeekTotals };


function addDayEarningsToWeekTotals(day, weekTotalsByCurrency) {
  const dayTotalTimeInMsec = day.totalTime.durationInMsec;
  if (!dayTotalTimeInMsec) return;

  const dayWage = day.settings.wage;
  const dayCurrency = dayWage ? dayWage.currency : null;

  const totalsForCurrency = findTotalsForCurrencyInTotalsByCurrency(dayCurrency, weekTotalsByCurrency);

  totalsForCurrency.totalTimeInMsec += dayTotalTimeInMsec;

  if (!day.earnings) return;

  totalsForCurrency.rawAmount += day.earnings.amount.raw;

  day.earnings.rates.forEach(rateInfo => {
    const fullRateInfo = {
      ...rateInfo,
      wage: dayWage
    };
    addRateEarningsToTotals(fullRateInfo, totalsForCurrency);
  });
}
