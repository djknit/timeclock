import { formatEarningsForCurrency, addDayEarningsToWeekTotals } from '../../utilities';

function getWeekEarnings(fullyProcessedDays) {
  let weekTotalEarningsByCurrency = [];
  fullyProcessedDays.forEach(day => addDayEarningsToWeekTotals(day, weekTotalEarningsByCurrency));
  return weekTotalEarningsByCurrency.length > 0 ? (
    weekTotalEarningsByCurrency.map(formatEarningsForCurrency)
  ) : (
    null
  );
}

export {
  getWeekEarnings
};
