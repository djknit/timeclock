const mongoose = require('mongoose');
// const moment = require('moment-timezone');

const valueScheduleSubdocFactory = require('./pieces/valueSchedule');
const intSubdocFactory = require('./pieces/integer');
const timezoneSubdocFactory = require('./pieces/timezone');
const wageSubdocFactory = require('./pieces/wage');
const dateSubdocFactory = require('./pieces/date');

const Schema = mongoose.Schema;

const JobSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  timezone: valueScheduleSubdocFactory(
    timezoneSubdocFactory()
  ),
  wage: valueScheduleSubdocFactory(
    wageSubdocFactory()
  ),
  dayCutoff: intSubdocFactory({
    validate: {
      validator(value) {
        if (value < -43200000 || value > 43200000) return false;
        return true;
      },
      message: 'Invalid day cutoff. Must be between -12 hours and 12 hours.'
    },
    default: 0
  }),
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

// source: http://jasonjl.me/blog/2014/10/23/adding-validation-for-embedded-objects-in-mongoose/
JobSchema.path('timezone').validate(
  arr => arr.length > 0,
  'You must have at least one timezone value.'
);
// JobSchema.path('wage').validate(
//   arr => arr.length > 0,
//   'You must have at least one wage value-date pair but the wage value can be null.'
// );

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;

