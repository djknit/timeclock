import { getCurrencyAmountInfo } from '../../../utilities';
export * from '../../../utilities';

const secsPerMin = 60;
const minsPerHr = 60;
const secsPerHr = secsPerMin * minsPerHr;

export {
  getDurationInfo,
  convertDayCutoffToMinutes,
  processWage
};


function getDurationInfo(durationInMsec) {
  const durationInSeconds = Math.round(durationInMsec / 1000);
  return {
    hours: Math.floor(durationInSeconds / secsPerHr),
    minutes: Math.floor(durationInSeconds / secsPerMin) % minsPerHr,
    seconds: durationInSeconds % secsPerMin,
    durationInMsec
  };
}

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
