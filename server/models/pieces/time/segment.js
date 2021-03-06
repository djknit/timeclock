const { Schema } = require('mongoose');

const intSubdocFactory = require('../integer');

const requiredInt = () => intSubdocFactory({ required: true });

const segmentSchema = new Schema({
  startTime: requiredInt(),
  endTime: requiredInt(),
  created: {
    time: intSubdocFactory({
      default: function() {
        return Date.now();
      }
    }),
    method: String
  },
  modified: [{
    time: requiredInt(),
    previousValue: {
      startTime: requiredInt(),
      endTime: requiredInt()
    },
    method: String
  }]
});

module.exports =  segmentSchema;
