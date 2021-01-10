export * from '../../utilities';
export * from './display';
export * from './input';

function getHourOptions(is24hr) {
  let options = [];
  for (let i = -12; i <= 12; i++) {
    const hoursBase = is24hr ? 24 : 12;
    let displayValue = (i + hoursBase) % hoursBase;
    if (!is24hr && displayValue === 0) displayValue = 12;
    options.push({
      value: i,
      name: displayValue
    });
  }
  return options;
}

export { getHourOptions };
