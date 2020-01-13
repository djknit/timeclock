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
  segments: [segmentsSubdocFactory()],
  timezone: timezoneSubdocFactory(),
  wage: wageSubdocFactory()
});

const daysSubdocFactory = () => ([{
  type: daySchema,
  validate: [
    {
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
      message: 'Invalid time segment(s): segment date doesn\'t match day date on at least one segment for this day.'
    }, {
      validator: value => {
        const { startCutoff, endCutoff, timezone, date } = value;
        const firstMidnight = moment.tz(new Date(date.year, date.month, date.day, 0, 0, 0, 0), timezone);
        const secondMidnight = firstMidnight.add(1, 'days');
        const startTime = firstMidnight.valueOf() + startCutoff;
        const endTime = secondMidnight.valueOf() + endCutoff;
        for (let i = 0; i < segments.length; i++) {
          if (segments[i].dayStartTime !== startTime || segments[i].dayEndTime !== endTime) return false;
        }
        return true;
      },
      message: 'Invalid time segment(s): segment `dayStartTime` and `dayEndTime` doesn\'t match day `startCutoff`/`endCutoff` and `timezone` for at least one segment for this day.'
    }, {
      validator: value => {
        const { segments, timezone } = value
        for (let i = 0; i < segments.length; i++) {
          if (segments[i].timezone !== timezone) return false;
        }
        return true;
      },
      message: 'Invalid time segment(s): segment timezone doesn\'t match day timezone on at least one segment for this day.'
    }, {
      validator: value => {
        const { segments } = value;
        let previousEndTime = 0;
        for (let i = 0; i < segments.length; i++) {
          const { startTime, endTime } = segments[i];
          if (i > 0 && startTime < previousEndTime) return false;
          previousEndTime = endTime;
        }
        return true;
      },
      message: 'Invalid time segments: overlapping segments.'
    }
  ]
}]);


module.exports = daysSubdocFactory;