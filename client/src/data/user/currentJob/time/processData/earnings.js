import { formatEarningsForCurrency, addWeekEarningsTotals } from './utilities';

function getJobEarnings(processedWeeks) {
  let totalEarningsByCurrency = [];
  processedWeeks.forEach(week => {
    addWeekEarningsTotals(week, totalEarningsByCurrency);
  });
  return totalEarningsByCurrency.map(formatEarningsForCurrency);
}

export {
  getJobEarnings
};