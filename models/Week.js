const mongoose = require('mongoose');
const { Schema } = mongoose;

const {
  getDateTime, getMostRecentScheduleValueForDate, areWagesEquivalent, convertMomentToMyDate, getMoment
} = require('../utilities');

const intSubdocFactory = require('./pieces/integer');
const dateSubdocFactory = require('./pieces/date');
const daysSubdocFactory = require('./pieces/time/days');
const valueScheduleSubdocFactory = require('./pieces/valueSchedule');
const timezoneSubdocFactory = require('./pieces/timezone');
const wageSubdocFactory = require('./pieces/wage');
const dayCutoffSubdocFactory = require('./pieces/dayCutoff');

const weekDataSchema = new Schema({
  days: daysSubdocFactory(),
  firstDate: dateSubdocFactory(),
  lastDate: dateSubdocFactory(),
  weekNumber: intSubdocFactory(),
  timezone: valueScheduleSubdocFactory(
    timezoneSubdocFactory()
  ),
  wage: valueScheduleSubdocFactory(
    wageSubdocFactory()
  ),
  dayCutoff: valueScheduleSubdocFactory(
    dayCutoffSubdocFactory()
  )
});

const WeekSchema = new Schema({
  data: {
    type: weekDataSchema,
    required: true,
    validate: {
      validator(data) {
        const { timezone, wage, dayCutoff } = data;
        for (let i = 0; i < data.days.length; i++) {
          const day = data.days[i];
          const precedingDate = convertMomentToMyDate(getMoment(day.date).subtract(1, 'days'));
          if (
            day.timezone !== getMostRecentScheduleValueForDate(date, timezone) ||
            !areWagesEquivalent(day.wage, getMostRecentScheduleValueForDate(day.date, wage)) ||
            day.startCutoff !== getMostRecentScheduleValueForDate(precedingDate, dayCutoff) ||
            day.endCutoff !== getMostRecentScheduleValueForDate(day.date, dayCutoff)
          ) return false;
        }
        return true;
      },
      message: 'Invalid day(s). Day `timezone`, `wage`, `startCutoff`, and/or `endCutoff` value does not match value schedule for at least one day.'
    }
  },
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