import { getCurrencyAmountInfo, constants, getDurationInfo } from '../../../utilities';
export * from '../../../utilities';

const { secsPerMin } = constants;

export {
  convertDayCutoffToMinutes,
  processWage
};


function convertDayCutoffToMinutes(rawValue = 0) {
  const mSecsPerMin = 1000 * secsPerMin;
  return Math.round(rawValue / mSecsPerMin);
}

function processWage(wage) {
  if (!wage) return null;
  const { rate, currency, overtime } = wage;
  return {
    rate: getCurrencyAmountInfo(rate, currency),
    currency,
    overtime: processOvertimeWage(overtime, rate, currency)
  };
}

function processOvertimeWage(overtime, baseRate, currency) {
  if (!overtime) return null;
  const { rate, rateMultiplier, useMultiplier, cutoff } = overtime;
  const actualRate = useMultiplier ? (rateMultiplier * baseRate) : rate;
  return {
    rate: getCurrencyAmountInfo(actualRate, currency),
    rateMultiplier,
    useMultiplier,
    cutoff: getDurationInfo(cutoff)
  };
}
