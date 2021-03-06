const moment = require('moment-timezone');
const { WageTest } = require('../../../../models');

module.exports = validateUpdateValues;

function validateUpdateValues(updates, propName) {
  const values = updates.map(({ value }) => value);
  if (propName === 'wage') return validateWages(values);
  else return new Promise((resolve, reject) => {
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (propName === 'timezone') validateTimezone(value);
      else if (propName === 'dayCutoff') validateDayCutoff(value);
      else validateWeekBeginsValue(value);
    }
    resolve();
  });
}

function validateTimezone(timezone) {
  if (moment.tz.zone(timezone) === null) throw new Error('Invalid timezone.');
}

function validateDayCutoff(dayCutoff) {
  validateInteger(dayCutoff);
  if (dayCutoff < -43200000 || dayCutoff > 43200000) {
    throw new Error('Invalid day cutoff. Must be between -12 and 12 hours.');
  }
}

function validateWeekBeginsValue(weekBeginsValue) {
  validateInteger(weekBeginsValue);
  if (weekBeginsValue < 0 || weekBeginsValue > 6) {
    throw new Error ('Invalid week cutoff. Must be an integer 0 - 6.');
  }
}

function validateInteger(val) {
  if (typeof(val) !== 'number') throw new Error('Failed integer validation: value is not a number.');
  if (val !== Math.floor(val)) throw new Error('Failed integer validation: value is a non-integer number.');
}

function validateWages(values) {
  return new Promise((resolve, reject) => {
    if (values.length === 0) return resolve();
    let numCompleted = 0;
    for (let i = 0; i < values.length; i++) {
      validateWage(values[i])
      .then(result => {
        if (++numCompleted === values.length) resolve();
      });
    }
  });
}

function validateWage(value) {
  return (
    WageTest
    .create({ wage: value })
    .then(testDoc => WageTest.findByIdAndDelete(testDoc._id))
  );
}
