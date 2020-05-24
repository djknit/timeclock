const wageDefaultValues = {
  currency: 'USD',
  overtime: {
    rateMultiplier: 1.5,
    useMultiplier: true,
    cutoff: 144000000
  }
};

const dayCutoffDefaultValue = 0;

const weekBeginsDefaultValue = 0;

module.exports = {
  wageDefaultValues,
  dayCutoffDefaultValue,
  weekBeginsDefaultValue
}