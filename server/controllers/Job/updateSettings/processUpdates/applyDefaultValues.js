const {
  wageDefaultValues, dayCutoffDefaultValue, weekBeginsDefaultValue
} = require('../utilities').constants;

module.exports = applyDefaultValuesToUpdates;

function applyDefaultValuesToUpdates(updates, propName) {
  updates.add.forEach(additionUpdate => {
    additionUpdate.value = getValueWithDefaultsApplied(additionUpdate.value, propName);
  });
  updates.edit.forEach(editingUpdate => {
    editingUpdate.value = getValueWithDefaultsApplied(editingUpdate.value, propName);
  });
};

function getValueWithDefaultsApplied(value, propName) {
  if (propName === 'wage') {
    return applyDefaultValuesToWage(value);
  }
  else if (propName === 'dayCutoff') {
    return (!value && value !== 0) ? dayCutoffDefaultValue : value;
  }
  else if (propName === 'weekBegins') {
    return (!value && value !== 0) ? weekBeginsDefaultValue : value;
  }
  else {
    return value;
  }
}

function applyDefaultValuesToWage(wage) {
  if (!wage) return wage;
  if (!wage.currency) {
    wage.currency = wageDefaultValues.currency;
  }
  if (!wage.overtime) {
    wage.overtime = null;
    return wage;
  }
  const { overtime } = wage;
  if (!overtime.rateMultiplier && overtime.rateMultiplier !== 0) {
    overtime.rateMultiplier = wageDefaultValues.overtime.rateMultiplier;
  }
  if (!overtime.useMultiplier && overtime.useMultiplier !== false) {
    overtime.useMultiplier = wageDefaultValues.overtime.useMultiplier;
  }
  if (!overtime.cutoff) {
    overtime.cutoff = wageDefaultValues.overtime.cutoff;
  }
  return wage;
}