const mongoose = require('mongoose');

const { getDateTime, getUtcDateTime } = require('../../utilities');

const dateSubdocFactory = require('./date');
const intSubdocFactory = require('./integer');

module.exports = valueOutline => {

  const valDatePairSchema = new mongoose.Schema(
    {
      value: valueOutline,
      startDate: dateSubdocFactory(),
      startDateUtcTime: intSubdocFactory()
    }
  );

  return {
    type: [valDatePairSchema],
    validate: [
      {
        validator: vals => vals.length > 0,
        message: 'Missing initial value. You must have at least one value.'
      }, {
        validator: vals => {
          if (!this) return true;
          return !vals[0].startDate;
        },
        message: 'Invalid initial value. The first value must not have a start date.'
      }, {
        validator: vals => {
          console.log('\n``````````````````````````````')
          console.log(vals)
          console.log(',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,, \n')
          for (let i = 1; i < vals.length; i++) {
            if (!vals[i].startDate) return false;
          }
          return true;
        },
        message: 'Missing date. All values in schedule except for the first must have a start date.'
      }, {
        validator: vals => {
          if (vals.length < 3) return true;
          let previousDateTime;
          for (let i = 1; i < vals.length; i++) {
            const valDateTime = getDateTime(vals[i].startDate);
            if (i > 1 && valDateTime <= previousDateTime) return false;
            previousDateTime = valDateTime;
          }
          return true;
        },
        message: 'Schedule must be in chronological order.'
      }, {
        validator: vals => {
          for (let i = 0; i < vals.length; i++) {
            const { startDate, startDateUtcTime } = vals[i];
            console.log(getUtcDateTime(startDate))
            console.log(startDateUtcTime)
            if (startDate && (!startDateUtcTime || getUtcDateTime(startDate) !== startDateUtcTime)) {
              return false;
            }
          }
          return true;
        },
        message: 'A schedule entry is missing `startDateUtcTime` or has a `startDateUtcTime` that does not match its `startDate`.'
      }
    ]
  };

};