import { formatEarnings, addWeekEarningsToTotals } from '../earnings';

function getJobEarnings(processedWeeks) {
  let totalEarningsByCurrency = [];
  processedWeeks.forEach(week => {
    addWeekEarningsToTotals(week, totalEarningsByCurrency);
  });
  return formatEarnings(totalEarningsByCurrency);
}

export {
  getJobEarnings
};