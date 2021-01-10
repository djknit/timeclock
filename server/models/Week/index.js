const mongoose = require('mongoose');
const { Schema } = mongoose;

const {
  intSubdocFactory,
  dateSubdocFactory,
} = require('../pieces');
const {
  daysSubdocFactory
} = require('./pieces');

const WeekSchema = new Schema({
  days: daysSubdocFactory(),
  firstDate: dateSubdocFactory({ required: true }),
  lastDate: dateSubdocFactory({ required: true }),
  weekNumber: intSubdocFactory({ required: true }),
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  }
});

const Week = mongoose.model('Week', WeekSchema);

module.exports = Week;
