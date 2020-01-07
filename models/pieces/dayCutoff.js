const mongoose = require('mongoose');

const intSubdocFactory = require('./integer');
const valueScheduleSubdocFactory = require('./valueSchedule');

module.exports = (useDefault) => {
  let result = valueScheduleSubdocFactory(
    intSubdocFactory({
      validate: {
        validator(value) {
          if (value < -43200000 || value > 43200000) return false;
          return true;
        },
        message: 'Invalid day cutoff. Must be between -12 hours and 12 hours.'
      }
    })
  );
  return useDefault ?
    {
      ...result,
      default: 0
    } :
    {
      ...result,
      required: true
    };
};