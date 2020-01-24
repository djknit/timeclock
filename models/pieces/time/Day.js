const mongoose = require('mongoose');
const { Schema } = mongoose;

const dayCutoffSubdocFactory = require('../dayCutoff');
const segmentsSubdocFactory = require('./segments');
const timezoneSubdocFactory = require('../timezone');
const wageSubdocFactory = require('../wage');
const dateSubdocFactory = require('../date');

const DaySchema = new Schema({
  date: dateSubdocFactory({ required: true }),
  startCutoff: dayCutoffSubdocFactory(false),
  endCutoff: dayCutoffSubdocFactory(false),
  segments: segmentsSubdocFactory(),
  timezone: timezoneSubdocFactory(),
  wage: wageSubdocFactory()
});

const Day = mongoose.model('Day', DaySchema);

module.exports = Day;