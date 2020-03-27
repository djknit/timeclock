const WeekController = require('./Week');
const JobController = require('./Job');
const segmentsController = require('./time/segments');
const weeksController = require('./time/weeks');

module.exports = {
  User: require('./User'),
  Job: JobController,
  Week: WeekController
};