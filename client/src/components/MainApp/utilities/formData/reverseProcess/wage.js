const defaultOvertime = {
  useOvertime: true,
  useMultiplier: true,
  multiplier: 1.5,
  rate: '',
  cutoff: {
    hours: 40,
    minutes: 0
  }
};

function convertWageToFormData(wage) {
  if (!wage) {
    return {
      useWage: false,
      rate: '',
      currency: 'USD',
      overtime: defaultOvertime
    };
  }
  const {  rate, currency, overtime } = wage;
  return {
    useWage: true,
    rate: rate.display.numeric,
    currency,
    overtime: convertOTWageToFormData(overtime)
  };
}

function convertOTWageToFormData(overtime) {
  const useOvertime = !!overtime;
  if (!useOvertime) return { ...defaultOvertime, useOvertime };
  const { useMultiplier, rateMultiplier, rate, cutoff } = overtime;
  return {
    useOvertime,
    useMultiplier,
    multiplier: rateMultiplier,
    rate: useMultiplier ? '' : rate.display.numeric,
    cutoff: convertOTCutoffToFormData(cutoff)
  };
}

function convertOTCutoffToFormData(cutoff) {
  const { hours, minutes } = cutoff;
  return { hours, minutes };
}

export { convertWageToFormData };