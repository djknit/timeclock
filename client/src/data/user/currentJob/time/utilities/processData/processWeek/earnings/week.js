import { formatEarnings, addDayEarningsToWeekTotals } from '../../../../../utilities';

function getWeekEarnings(fullyProcessedDays) {
  let weekTotalEarningsByCurrency = [];
  fullyProcessedDays.forEach(day => addDayEarningsToWeekTotals(day, weekTotalEarningsByCurrency));
  return formatEarnings(weekTotalEarningsByCurrency);
}

export {
  getWeekEarnings
};
