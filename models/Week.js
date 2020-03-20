const mongoose = require('mongoose');
const { Schema } = mongoose;

const {
  getUtcMoment, getMostRecentScheduleValueForDate, areWagesEquivalent, convertMomentToMyDate, getMoment, getDateTime
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
  firstDate: dateSubdocFactory({ required: true }),
  lastDate: dateSubdocFactory({ required: true }),
  weekNumber: intSubdocFactory({ required: true }),
  timezone: valueScheduleSubdocFactory(
    timezoneSubdocFactory({ required: true })
  ),
  wage: valueScheduleSubdocFactory(
    wageSubdocFactory({ required: true })
  ),
  dayCutoff: valueScheduleSubdocFactory(
    dayCutoffSubdocFactory()
  )
});

const WeekSchema = new Schema({
  data: {
    type: weekDataSchema,
    required: true,
    validate: [
      {
        validator(data) {
          return getDateTime(data.firstDate) <= getDateTime(data.lastDate);
        },
        message: 'Invalid `firstDate`/`lastDate` combination for this week. First date must not come after last date.'
      }, {
        validator(data) {
          const { timezone, wage, dayCutoff, days } = data;
          for (let i = 0; i < days.length; i++) {
            const day = days[i];
            const precedingDate = convertMomentToMyDate(getMoment(day.date).subtract(1, 'days'));
            if (
              day.timezone !== getMostRecentScheduleValueForDate(day.date, timezone) ||
              !areWagesEquivalent(day.wage, getMostRecentScheduleValueForDate(day.date, wage)) ||
              day.startCutoff !== getMostRecentScheduleValueForDate(precedingDate, dayCutoff) ||
              day.endCutoff !== getMostRecentScheduleValueForDate(day.date, dayCutoff)
            ) return false;
          }
          return true;
        },
        message: 'Invalid day(s). Day `timezone`, `wage`, `startCutoff`, and/or `endCutoff` value does not match value schedule for at least one day.'
      }, {
        validator(data) {
          // console.log('% '.repeat(30))
          // console.log(data)
          console.log('% '.repeat(30))
          // Only checks that week has correct number of days and that those days fall within the week timespan. The days subdoc validates that the days are chronological and not duplicated.
          const { days, firstDate, lastDate } = data;
          const expectedNumberOfDays = getMoment(lastDate).diff(getMoment(firstDate), 'days') + 1;
          if (days.length !== expectedNumberOfDays) return false;
          const firstDateTime = getDateTime(firstDate);
          const lastDateTime = getDateTime(lastDate);
          for (let i = 0; i < days.length; i++) {
            const dayDateTime = getDateTime(days[i].date);
            if (dayDateTime < firstDateTime || dayDateTime > lastDateTime) return false;
          }
          return true;
        },
        message: 'Invalid day(s). This week is missing day(s) and/or contains day(s) that do not fall within its time range.'
      }
    ]
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