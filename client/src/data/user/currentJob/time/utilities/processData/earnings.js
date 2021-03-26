import { formatEarnings, addWeekEarningsToTotals } from '../../../utilities';

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