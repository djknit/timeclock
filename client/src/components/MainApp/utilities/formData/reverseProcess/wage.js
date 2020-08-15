function convertWageToFormData(wage) {
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
    rate,
    currency,
    overtime: (
      overtime ?
      {
        useOvertime: true,
        useMultiplier: overtime.useMultiplier,
        multiplier: overtime.rateMultiplier,
        rate: (overtime.rate || overtime.rate === 0) ? overtime.rate.toString() : '',
        cutoff: convertOTCutoffToFormData(overtime.cutoff)
      } :
      {
        ...defaultOvertime,
        useOvertime: false
      }
    )
  };
}
function convertOTCutoffToFormData(oTCutoff) {
  const cutoffInMinutes = Math.round(oTCutoff / (60 * 1000));
  return {
    hours: Math.floor(cutoffInMinutes / 60),
    minutes: cutoffInMinutes % 60
  };
}

export { convertWageToFormData };