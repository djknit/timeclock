const mongoose = require('mongoose');

const { wageSubdocFactory } = require('./pieces');

const WageTestSchema = new mongoose.Schema({
  wage: wageSubdocFactory()
});

const WageTest = mongoose.model('Test', WageTestSchema);

module.exports = WageTest;
