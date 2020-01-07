const { Schema } = require('mongoose');

var moment = require('moment-timezone');

const dayCutoffSubdocFactory = require('../dayCutoff');
const timezoneSubdocFactory = require('../timezone');
const dateSubdocFactory = require('../date');
const intSubdocFactory = require('../integer');

const segmentSchema = new Schema({
  dayStartTime: intSubdocFactory({ required: true }),
  dayEndTime: intSubdocFactory({ required: true }),
  timezone: timezoneSubdocFactory(),
  date: dateSubdocFactory({ required: true }),
  startTime: intSubdocFactory({ required: true }),
  endTime: intSubdocFactory({ required: true })
});

const segmentSubdocFactory = () => ({
  type: segmentSchema,
  validate: [
    {
      validator: value => {
        const { dayStartTime, timezone, date } = value;
        const midnight = moment.tz(new Date(date.year, date.month, date.day, 0, 0, 0, 0), timezone).valueOf;
        return midnight - 43200000 <= dayStartTime && dayStartTime <= midnight + 43200000;
      },
      message: 'Invalid `dayStartTime`. Must be within 12 hours of midnight in specified timezone.'
    }, {
      validator: value => {
        const { dayEndTime, timezone, date } = value;
        const midnight = moment.tz(new Date(date.year, date.month, date.day, 0, 0, 0, 0), timezone).add(1, 'day').valueOf;
        return midnight - 43200000 <= dayEndTime && dayEndTime <= midnight + 43200000;
      },
      message: 'Invalid `dayEndTime`. Must be within 12 hours of midnight in specified timezone.'
    }, {
      validator: value => {
        const { dayEndTime, dayStartTime, startTime } = value;
        return dayStartTime <= startTime && startTime <= dayEndTime;
      },
      message: 'Invalid `startTime`; value doesn\'t fall within the day specified.'
    }, {
      validator: value => {
        const { dayEndTime, dayStartTime, endTime } = value;
        return dayStartTime <= endTime && endTime <= dayEndTime;
      },
      message: 'Invalid `endTime`; value doesn\'t fall within the day specified.'
    }, {
      validator: value => {
        const { startTime, endTime } = value;
        return startTime > endTime;
      },
      message: 'Invalid `startTime` and `endTime` combination. `startTime` must be before `endTime`.'
    }
  ]
});

module.exports =  () => ({
  type: [segmentSubdocFactory()],
  validate: {
    validator: values => {
      let previousEndTime = 0;
      for (let i = 0; i < values.length; i++) {
        const { startTime, endTime } = values[i];
        if (i > 0 && startTime < previousEndTime) return false;
        previousEndTime = endTime;
      }
      return true;
    },
    message: 'Invalid time segments; overlapping segments.'
  },
  required: true
});