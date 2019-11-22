const mongoose = require('mongoose');

const moment = require('moment-timezone');

const Schema = mongoose.Schema;

const JobSchema = new Schema({
  name: String,
  timezone: [{
    
  }],
  pay: {

  },
  dayCutoff: {
    type: Number,
    min: -43200000,
    max: 43200000
  },
  weekCutoff: String,
  startDate: {

  }
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;

