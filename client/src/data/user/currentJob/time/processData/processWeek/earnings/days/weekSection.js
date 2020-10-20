import { getDurationInfo, getCurrencyAmountInfo } from '../../../../utilities';


// Calculate earrnings for a single day or segment.
  // works for any consecutive section of week in which wage doesn't change; only needed for day and segment
function getWeekSectionEarnings(sectionTotalTimeInMsec, wage, cumulativeWeeklyTime) {
  if (sectionTotalTimeInMsec === 0) return null;
  const _wage = processWageForEarningsCalc(wage);
  if (!_wage) return null;
  const { overtimeCutoff, overtimeRate, currency, useOvertime, baseRate } = _wage;
  const _getRateInfo = rateInfoGetterFactory(currency);
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
    rawAmountEarned = _rate * getHoursFromMsecs(sectionTotalTimeInMsec);
    rates = [_getRateInfo(_rate, sectionTotalTimeInMsec, isWholeSectionOvertime)]
  }

  const amount = getCurrencyAmountInfo(rawAmountEarned, currency);
  return { currency, amount, rates };
}

export { getWeekSectionEarnings };


function processWageForEarningsCalc(wage) {
  if (!wage) return null;
  const { currency, overtime } = wage;
  const baseRate = wage.rate.raw;
  const useOvertime = !!overtime;
  let overtimeCutoff, overtimeRate;
  if (overtime) {
    overtimeCutoff = overtime.cutoff.durationInMsec;
    overtimeRate = overtime.useMultiplier ? (overtime.rateMultiplier * baseRate) : overtime.rate.raw;
  }
  return { baseRate, currency, useOvertime, overtimeCutoff, overtimeRate };
}

function rateInfoGetterFactory(currency) {
  return function (rawRateValue, timeAtRateInMsec, isOvertime) {
    const rawAmountEarned = rawRateValue * getHoursFromMsecs(timeAtRateInMsec);
    return {
      rate: getCurrencyAmountInfo(rawRateValue, currency),
      duration: getDurationInfo(timeAtRateInMsec),
      isOvertime: !!isOvertime,
      amountEarned: getCurrencyAmountInfo(rawAmountEarned, currency)
    };
  };
}

function getHoursFromMsecs(timeInMsecs) {
  return timeInMsecs / (1000 * 60 * 60);
}
