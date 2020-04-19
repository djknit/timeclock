const mongoose = require('mongoose');

const wageSubdocFactory = require('../models/pieces/wage');

const TestSchema = new mongoose.Schema({
  wage: wageSubdocFactory()
});

const Test = mongoose.model('Test', TestSchema);

module.exports = {
  validateWage,
  validateWages
};

function validateWage(value) {
  return new Promise((resolve, reject) => {
    Test
    .create({ wage: value })
    .then(testDoc => Test.findByIdAndDelete(testDoc._id))
    .then(resolve)
    .catch(reject);
  });
}

function validateWages(values) {
  return new Promise((resolve, reject) => {
    let numCompleted = 0;
    for (let i = 0; i < values.length; i++) {
      validateWage(values[i])
      .then(result => {
        if (++numCompleted === values.length) resolve();
      })
      .catch(reject);
    }
  });
}