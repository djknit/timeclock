const { Schema } = require('mongoose');

const { getMoment } = require('../../../utilities');

const dayCutoffSubdocFactory = require('../dayCutoff');
const timezoneSubdocFactory = require('../timezone');
const dateSubdocFactory = require('../date');
const intSubdocFactory = require('../integer');

const segmentSchema = new Schema({
  dayStartCutoff: dayCutoffSubdocFactory({ required: true }),
  dayEndCutoff: dayCutoffSubdocFactory({ required: true }),
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
          const dayEndTime = getMoment(date, timezone).add(1, 'days').valueOf() + dayEndCutoff;
          if (
            startTime < dayStartTime ||
            startTime > dayEndTime ||
            endTime < dayStartTime ||
            endTime > dayEndTime
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
          if (startTime >= endTime) return false;
        }
        return true;
      },
      message: 'Invalid `startTime` and `endTime` combination for at least one segment. `startTime` must be before `endTime`.'
    }, {
      validator: segments => {
        console.log('VALIDATING SEGMENTS . .')
        console.log(segments)
        let previousEndTime;
        for (let i = 0; i < segments.length; i++) {
          const { startTime, endTime } = segments[i];
          console.log('##########')
          console.log(endTime)
          console.log(startTime);
          console.log(previousEndTime)
          console.log(i)
          console.log(i > 0 && startTime < previousEndTime)
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