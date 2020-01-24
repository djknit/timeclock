const { Schema } = require('mongoose');

const moment = require('moment-timezone');

const { getMoment } = require('../../../utilities');

const dayCutoffSubdocFactory = require('../dayCutoff');
const timezoneSubdocFactory = require('../timezone');
const dateSubdocFactory = require('../date');
const intSubdocFactory = require('../integer');

const segmentSchema = new Schema({
  dayStartCutoff: intSubdocFactory({ required: true }),
  dayEndCutoff: intSubdocFactory({ required: true }),
  timezone: timezoneSubdocFactory(),
  date: dateSubdocFactory({ required: true }),
  startTime: intSubdocFactory({ required: true }),
  endTime: intSubdocFactory({ required: true })
});

const segmentsSubdocFactory = () => ({
  type: [segmentSchema],
  validate: [
    {
      validator: segments => {
        for (let i = 0; i < segments.length; i++) {
          const { dayEndCutoff, dayStartCutoff, startTime, endTime, date, timezone } = segments[i];
          const dayStartTime = getMoment(date, timezone).valueOf() + dayStartCutoff;
          const dayEndTime = getMoment(date, timezone).valueOf() + dayEndCutoff;
          if (
            (dayStartTime <= startTime && startTime <= dayEndTime) ||
            (dayStartTime <= endTime && endTime <= dayEndTime)
          ) {
            return false;
          }
        }
        return true;
      },
      message: 'Invalid `startTime` or `endTime` for at least one segment. Value doesn\'t fall within the day specified.'
    }, {
      validator: segments => {
        for (let i = 0; i < segments.length; i++) {
          const { startTime, endTime } = segments[i];
          if (startTime <= endTime) return false;
        }
        return true;
      },
      message: 'Invalid `startTime` and `endTime` combination for at least one segment. `startTime` must be before `endTime`.'
    }, {
      validator: segments => {
        let previousEndTime;
        for (let i = 0; i < segments.length; i++) {
          const { startTime, endTime } = segments[i];
          if (i > 0 && startTime < previousEndTime) return false;
          previousEndTime = endTime;
        }
        return true;
      },
      message: 'Invalid time segments: overlapping or incorrectly ordered segments. Segments must be in chronological order and cannot overlap.'
    }
  ]
});

module.exports =  segmentsSubdocFactory;