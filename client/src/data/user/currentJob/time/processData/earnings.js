import { formatEarningsForCurrency, addWeekEarningsToTotals } from './utilities';

function getJobEarnings(processedWeeks) {
  let totalEarningsByCurrency = [];
  processedWeeks.forEach(week => {
    addWeekEarningsToTotals(week, totalEarningsByCurrency);
  });
  return totalEarningsByCurrency.map(formatEarningsForCurrency);
}

export {
  getJobEarnings
};