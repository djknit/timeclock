const { Schema } = require('mongoose');

const {
  areDatesEquivalent, getDateTime
} = require('../../../utilities');

const dayCutoffSubdocFactory = require('../dayCutoff');
const segmentsSubdocFactory = require('./segments');
const timezoneSubdocFactory = require('../timezone');
const wageSubdocFactory = require('../wage');
const dateSubdocFactory = require('../date');

const daySchema = new Schema({
  startCutoff: dayCutoffSubdocFactory(false),
  endCutoff: dayCutoffSubdocFactory(false),
  segments: segmentsSubdocFactory(),
  timezone: timezoneSubdocFactory(),
  wage: wageSubdocFactory(),
  date: dateSubdocFactory()
});

const daysSubdocFactory = () => ({
  type: [daySchema],
  validate: [
    {
      validator(days) {
        for (let i = 0; i < days.length; i++) {
          const { startCutoff, endCutoff, segments, timezone, date } = days[i];
          for (let j = 0; j < segments.length; j++) {
            const segment = segments[j];
            if (
              segment.dayStartCutoff !== startCutoff ||
              segment.dayEndCutoff !== endCutoff ||
              segment.timezone !== timezone ||
              !areDatesEquivalent(segment.date, date)
            ) return false;
          }
        }
        return true;
      },
      message: 'Segment data does not match day data for at least one segment on at least one day for this week.'
    }, {
      validator(days) {
        let previousDateTime;
        for (let i = 0; i < days.length; i++) {
          const dateTime = getDateTime(days[i].date);
          if (i > 0 && dateTime <= previousDateTime) return false;
          previousDateTime = dateTime;
        }
        return true;
      },
      message: 'Invalid days. Days must be in chronological order and dates cannot be duplicated.'
    }
  ]
});

module.exports = daysSubdocFactory;