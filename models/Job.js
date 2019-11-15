const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const JobSchema = new Schema({
  name: String,
  hourlyPayRate: Number,
  cutoffs: {
    day: {
      type: Number,
      min: -43200000,
      max: 43200000
    },
    month: Date
  }
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;