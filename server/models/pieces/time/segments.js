const { Schema } = require('mongoose');

const intSubdocFactory = require('../integer');

const segmentSchema = new Schema({
  startTime: intSubdocFactory({ required: true }),
  endTime: intSubdocFactory({ required: true })
});

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