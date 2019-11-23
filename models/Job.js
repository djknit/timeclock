const mongoose = require('mongoose');
const moment = require('moment-timezone');

const valueScheduleSubdocFactory = require('./pieces/valueSchedule');
const timezoneSubdocFactory = require('./pieces/timezone');
const wageSubdocFactory = require('./pieces/wage');
const dateSubdocFactory = require('./pieces/date');

const Schema = mongoose.Schema;

const JobSchema = new Schema({
  name: String,
  timezone: valueScheduleSubdocFactory(timezoneSubdocFactory()),
  wage: valueScheduleSubdocFactory(wageSubdocFactory()),
  dayCutoff: {
    type: Number,
    min: -43200000,
    max: 43200000
  },
  weekCutoff: String,
  startDate: dateSubdocFactory()
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;

