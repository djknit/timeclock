const mongoose = require('mongoose');
// const moment = require('moment-timezone');

const valueScheduleSubdocFactory = require('./pieces/valueSchedule');
const intSubdocFactory = require('./pieces/integer');
const timezoneSubdocFactory = require('./pieces/timezone');
const wageSubdocFactory = require('./pieces/wage');
const dateSubdocFactory = require('./pieces/date');

const Schema = mongoose.Schema;

const JobSchema = new Schema({
  name: String,
  timezone: valueScheduleSubdocFactory(
    timezoneSubdocFactory()
  ),
  wage: valueScheduleSubdocFactory(
    wageSubdocFactory()
  ),
  dayCutoff: {
    type: Number,
    min: -43200000,
    max: 43200000,
    default: 0
  },
  weekBegins: intSubdocFactory({
    validate: {
      validator(value) {
        if (value < 0 || value > 6) return false;
        return true;
      },
      message: 'Invalid week cutoff. Must be an integer 0 - 6. Sunday is 0, Monday is 1, etc.'
    },
    default: 0
  }),
  startDate: dateSubdocFactory()
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;

