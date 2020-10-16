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
  const { currency, overtime } = wage;
  const baseRate = wage.rate.raw;
  const useOvertime = !!overtime;
  let overtimeCutoff, overtimeRate;
  if (overtime) {
    overtimeCutoff = overtime.cutoff.durationInMsec;
    overtimeRate = overtime.useMultiplier ? overtime.rateMultiplier * rate.raw : overtime.rate.raw;
  }
  return { baseRate, currency, useOvertime, overtimeCutoff, overtimeRate };
}

function addEarningsToDay(day, cumulativeWeeklyTime) {
  let _cumulativeTime = cumulativeWeeklyTime;
  const _wage = processWageForEarningsCalc(day.settings.wage);
  if (!_wage) {
    day.earnings = null;
    return;
  };
  day.earnings = { currency: _wage.currency };
  let amountEarned = 0;
  day.segments.forEach(segment => {
    addEarningsToSegment(segment, _wage, _cumulativeTime); 
    _cumulativeTime += segment.duration.durationInMsec;
    amountEarned += segment.earnings.amount;
    
  });
}

function addEarningsToSegment(segment, processedWage, cumulativeWeeklyTime) {
  if (!processedWage) {
    segment.earnings = null;
    return;
  }
  const _segDuration = segment.duration.durationInMsec;
  const _segDurationInHours = _segDuration / (1000 * 60 * 60);
  const { overtimeCutoff, overtimeRate, currency, baseRate } = processedWage;
  const isWholeSegmentOvertime = overtimeCutoff && cumulativeWeeklyTime >= overtimeCutoff;
  const isPartialSegmentOvertime = (
    overtimeCutoff &&
    !isWholeSegmentOvertime &&
    cumulativeWeeklyTime + _segDuration > overtimeCutoff
  );
  let rates, amount;
  if (isPartialSegmentOvertime) {
    const timeAtBaseRateInMsec = overtimeCutoff - cumulativeWeeklyTime;
    const timeAtOvertimeInMsec = _segDuration - timeAtBaseRateInMsec;
    amount = (baseRate * timeAtBaseRateInMsec) + (overtimeRate * timeAtOvertimeInMsec);
    rates = [
      _getRateInfo(baseRate, timeAtBaseRateInMsec, false),
      _getRateInfo(overtimeRate, timeAtOvertimeInMsec, true)
    ];
  }
  else {
    const _rate = isWholeSegmentOvertime ? overtimeRate : baseRate;
    amount = _rate * _segDurationInHours;
    rates = [_getRateInfo(_rate, _segDuration, isWholeSegmentOvertime)];
  }
  segment.earnings = { currency, rates, amount };

  function _getRateInfo(_rateValue, _durationAtRate, _isOvertime) {
    return {
      rate: getCurrencyAmountInfo(_rateValue),
      duration: getDurationInfo(_durationAtRate),
      _isOvertime: !!_isOvertime
    };
  }
}

function getWeekSectionEarnings(sectionTotalTimeInMsec, processedWage, cumulativeWeeklyTime) { // for day or segment
  const _wage = processWageForEarningsCalc(processedWage);
  if (!_wage) return null;
  const { overtimeCutoff, overtimeRate, currency, useOvertime, baseRate } = _wage;
  const isWholeSectionOvertime = useOvertime && cumulativeWeeklyTime >= overtimeCutoff;
  const isPartialSectionOvertime = (
    useOvertime &&
    !isWholeSectionOvertime &&
    cumulativeWeeklyTime + sectionTotalTimeInMsec > overtimeCutoff
  );
  let rates, rawAmountEarned;
  if (isPartialSectionOvertime) {
    const timeAtBaseRateInMsec = overtimeCutoff - cumulativeWeeklyTime;
    const timeAtOvertimeInMsec = sectionTotalTimeInMsec - timeAtBaseRateInMsec;
    rawAmountEarned = (
      (baseRate * getHoursFromMsecs(timeAtBaseRateInMsec)) +
      (overtimeRate * getHoursFromMsecs(timeAtOvertimeInMsec))
    );
    rates = [
      _getRateInfo(baseRate, timeAtBaseRateInMsec, false),
      _getRateInfo(overtimeRate, timeAtOvertimeInMsec, true)
    ];
  }
  else {
    const _rate = isWholeSectionOvertime ? overtimeRate : baseRate;
    rawAmountEarned = _rate * getHoursFromMsecs(sectionTotalTimeInHours);
    rates = [_getRateInfo(_rate, sectionTotalTimeInMsec, isWholeSectionOvertime)]
  }
  amount = getCurrencyAmountInfo(rawAmountEarned, currency);
  return { currency, amount, rates };

  function _getRateInfo(_rawRateValue, _durationAtRate, _isOvertime) {
    return {
      rate: getCurrencyAmountInfo(_rawRateValue, currency),
      duration: getDurationInfo(_durationAtRate),
      isOvertime: !!_isOvertime
    };
  }
}

function getHoursFromMsecs(timeInMsecs) {
  return timeInMsecs / (1000 * 60 * 60);
}