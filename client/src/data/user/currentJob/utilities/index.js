import { getCurrencyAmountInfo } from '../../../utilities';
export * from '../../../utilities';

function getDurationInfo(durationInMsec) {
  const durationInSeconds = Math.round(durationInMsec / 1000);
  return {
    hours: Math.floor(durationInSeconds / (60 * 60)),
    minutes: Math.floor(durationInSeconds / 60) % 60,
    seconds: durationInSeconds % 60,
    durationInMsec
  };
}

function convertDayCutoffToMinutes(rawValue = 0) {
  return Math.round(rawValue / (1000 * 60));
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

export {
  getDurationInfo,
  convertDayCutoffToMinutes,
  processWage
};