import { getDurationInfo, processWage, getCurrencyAmountInfo } from '../../utilities';

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
  day.earnings = { currency };
  let amountEarned = 0;
  day.segments.forEach(segment => {
    addEarningsToSegment(segment, _wage, _cumulativeTime); 
    _cumulativeTime += segment.duration.durationInMsec;
    amountEarned += segment.earnings.amount;
    
  });
}

function addEarningsToSegment(segment, proccessedWage, cumulativeWeeklyTime) {
  if (!proccessedWage) {
    segment.earnings = null;
    return;
  }
  const _segDuration = segment.duration.durationInMsec;
  const _segDurationInHours = _segDuration / (1000 * 60 * 60);
  const { overtimeCutoff, overtimeRate, currency, rate: baseRate } = proccessedWage;
  const isWholeSegmentOvertime = overtimeCutoff && cumulativeWeeklyTime >= overtimeCutoff;
  const isPartialSegmentOvertime = (
    overtimeCutoff &&
    !isWholeSegmentOvertime &&
    cumulativeWeeklyTime + _segDuration > overtimeCutoff
  );
  let rates, amount;
  if (isPartialSegmentOvertime) {
    const durationAtBaseRate = overtimeCutoff - cumulativeWeeklyTime;
    const durationAtOvertime = _segDuration - durationAtBaseRate;
    amount = (baseRate * durationAtBaseRate) + (overtimeRate * durationAtOvertime);
    rates = [
      _getRateInfo(baseRate, durationAtBaseRate, false),
      _getRateInfo(overtimeRate, durationAtOvertime, true)
    ];
  }
  else {
    const _rate = isWholeSegmentOvertime ? overtimeRate : baseRate;
    amount = _rate * _segDurationInHours;
    rates = [_getRateInfo(_rate, _segDuration, isWholeSegmentOvertime)];
  }
  segment.earnings = { currency, rates, amount };

  function _getRateInfo(rateValue, durationAtRate, isOvertime) {
    return {
      rate: getCurrencyAmountInfo(rateValue),
      duration: getDurationInfo(durationAtRate),
      isOvertime: !!isOvertime
    };
  }
}

function addEarningsToPortionOfWeek(portion, portionDuration, wage, cumulativeWeeklyTime) {
  const _wage = processWageForEarningsCalc(wage);
  if (!_wage) portion.earnings = null;
  const { overtimeCutoff, overtimeRate, currency, useOvertime, rate: baseRate } = _wage;
  const portionDurationInHours = portionDuration / (1000 * 60 * 60);
  const isWholePortionOvertime = overtimeCutoff && cumulativeWeeklyTime >= overtimeCutoff;
  const isPartialPortionOvertime = (
    overtimeCutoff &&
    !isWholePortionOvertime &&
    cumulativeWeeklyTime + portionDuration > overtimeCutoff
  );
  let rates, amount;
  if (isPartialPortionOvertime) {
    const durationAtBaseRate = overtimeCutoff - cumulativeWeeklyTime;
    const durationAtOvertime = portionDuration - durationAtBaseRate;
    amount = (baseRate * durationAtBaseRate) + (overtimeRate * durationAtOvertime);
  }
  else {
    const _rate = isWholePortionOvertime ? overtimeRate : baseRate;
    amount = _rate * portionDurationInHours
  }
}