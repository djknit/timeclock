const { segmentSchema } = require('../../pieces');

const segmentsSubdocFactory = () => ({
  type: [segmentSchema],
  validate: [
    {
      validator: segments => {
        for (let i = 0; i < segments.length; i++) {
          const { startTime, endTime } = segments[i];
          if (startTime >= endTime) return false;
        }
        return true;
      },
      message: 'Invalid `startTime` and `endTime` combination. `startTime` must be before `endTime`.'
    }, {
      // can't rely on for update
      validator: segments => {
        let previousSegEndTime;
        for (let i = 0; i < segments.length; i++) {
          const { startTime, endTime } = segments[i];
          if (i > 0 && startTime < previousSegEndTime) return false;
          previousSegEndTime = endTime;
        }
        return true;
      },
      message: 'Invalid segments. Segments must be in chronological order and cannot overlap.'
    }
  ]
});

module.exports =  segmentsSubdocFactory;
