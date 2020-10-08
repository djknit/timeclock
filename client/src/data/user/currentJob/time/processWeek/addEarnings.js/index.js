export default function addEarnings(days) {
  let cumulativeMsecsWorked = 0;
  
  days.forEach(day => {
    addEarningsToDay(day, cumulativeWeeklyTime);
    cumulativeMsecsWorked += day.totalTime.durationInMsec;
  });
};

function processWageForEarningsCalc(wage) {
  if (!wage) return null;
  const { rate, currency, overtime } = wage;
  const useOvertime = !!overtime;
  let overtimeCutoff, overtimeRate;
  if (overtime) {
    overtimeCutoff = overtime.cutoff;
    overtimeRate = overtime.useMultiplier ? overtime.rateMultiplier * rate : overtime.rate;
  }
  return { rate, currency, useOvertime, overtimeCutoff, overtimeRate };
}

function addEarningsToDay(day, cumulativeWeeklyTime) {
  let _cumulativeTime = cumulativeWeeklyTime;
  const _wage = processWageForEarningsCalc(day.wage);
  if (!_wage) {
    day.earnings = null;
    return;
  };
  day.segments.forEach(segment => {
    const _segDuration = segment.duration.durationInMsec;
    
  });
}