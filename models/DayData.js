const mongoose = require('mongoose');
const { Schema } = mongoose;

const dayCutoffSubdocFactory = require('./pieces/dayCutoff');
const segmentsSubdocFactory = require('./pieces/time/segments');
const timezoneSubdocFactory = require('./pieces/timezone');
const wageSubdocFactory = require('./pieces/wage');
const dateSubdocFactory = require('./pieces/date');

const DaySchema = new Schema({
  startCutoff: dayCutoffSubdocFactory(false),
  endCutoff: dayCutoffSubdocFactory(false),
  segments: segmentsSubdocFactory(),
  timezone: timezoneSubdocFactory(),
  wage: wageSubdocFactory(),
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: dateSubdocFactory()
});

const Day = mongoose.model('Day', DaySchema);

module.exports = Day;