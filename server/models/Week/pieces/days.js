const { Schema } = require('mongoose');

const {
  getDateTime, getMoment
} = require('../../../utilities');

const {
  dayCutoffSubdocFactory,
  timezoneSubdocFactory,
  wageSubdocFactory,
  dateSubdocFactory
} = require('../../pieces');
const segmentsSubdocFactory = require('./segments');

const daySchema = new Schema({
  startCutoff: dayCutoffSubdocFactory(false),
  endCutoff: dayCutoffSubdocFactory(false),
  segments: segmentsSubdocFactory(),
  startTimezone: timezoneSubdocFactory(),
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
          const { startCutoff, endCutoff, date, startTimezone, timezone, segments } = days[i];
          for (let j = 0; j < segments.length; j++) {
            const { startTime, endTime } = segments[j];
            const dayStartTime = getMoment(date, startTimezone).valueOf() + startCutoff;
            const dayEndTime = getMoment(date, timezone).add(1, 'days').valueOf() + endCutoff;
            if (
              startTime < dayStartTime ||
              startTime > dayEndTime ||
              endTime < dayStartTime ||
              endTime > dayEndTime
            ) {
              return false;
            }
          }
        }
        return true;
      },
      message: 'Invalid `startTime` or `endTime` for at least one segment. Value doesn\'t fall within the day specified.'
    }, {
      // can't rely on for update
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