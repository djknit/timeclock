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
    }
  ]
});

module.exports =  segmentsSubdocFactory;
