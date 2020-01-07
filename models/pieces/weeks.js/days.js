const { Schema } = require('mongoose');

const dayCutoffSubdocFactory = require('../dayCutoff');
const segmentsSubdocFactory = require('./segments');
const timezoneSubdocFactory = require('../timezone');
const wageSubdocFactory = require('../wage');
const dateSubdocFactory = require('../date');

const daySchema = new Schema({
  date: dateSubdocFactory({ required: true }),
  startCutoff: dayCutoffSubdocFactory(false),
  endCutoff: dayCutoffSubdocFactory(false),
  segments: segmentsSubdocFactory(),
  timezone: timezoneSubdocFactory(),
  wage: wageSubdocFactory()
});

const daySubdocFactory = () => ({
  type: daySchema,
  validate: {
    validator: value => {
      const { segments, date } = value
      for (let i = 0; i < segments.length; i++) {
        const segmentDate = segments[i].date;
        if (
          segmentDate.day !== date.day ||
          segmentDate.year !== date.year ||
          segmentDate.month !== date.month
        ) return false;
      }
      return true;
    },
    message: 'Invalid time segment(s): date doesn\'t match.'
  },
  validate: {
    validator: values => {
      const { startCutoff, timezone, date } = value;
      const midnight = moment.tz(new Date(date.year, date.month, date.day, 0, 0, 0, 0), timezone).valueOf;
      const startTime = midnight + startCutoff;
      for (let i = 0; i < segments.length; i++) {
        if (
          segmentDate.day !== date.day ||
          segmentDate.year !== date.year ||
          segmentDate.month !== date.month
        ) return false;
      }
      return true;
    },
    message: 'Invalid time segment(s): segment `dayStartTime`s and `dayEndTime`s do not all match day `startCutoff`/`endCutoff`.'
  },
  validate: {
    validator: values => {
      const { segments, timezone } = value
      for (let i = 0; i < segments.length; i++) {
        if (segments[i].timezone !== timezone) return false;
      }
      return true;
    },
    message: 'Invalid time segment(s): timezone doesn\'t match.'
  }
});


module.exports =  () => ({
  type: [daySubdocFactory()],
  validate: {
    validator: values => {
      return true;
    },
    message: 'Invalid time segment(s): date doesn\'t match.'
  },
  validate: {
    validator: values => {
      return true;
    },
    message: 'Invalid time segment(s): day cutoff doesn\'t match.'
  },
  validate: {
    validator: values => {
      return true;
    },
    message: 'Invalid time segment(s):  doesn\'t match.'
  },
  required: true
});