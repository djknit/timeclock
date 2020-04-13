const mongoose = require('mongoose');

const { getDateTime } = require('../../utilities');

const dateSubdocFactory = require('./date');

module.exports = valueOutline => {

  const valDatePairSchema = new mongoose.Schema(
    {
      value: valueOutline,
      startDate: dateSubdocFactory()
    }
  );

  return {
    type: [valDatePairSchema],
    validate: [
      {
        validator: vals => vals.length > 0,
        message: 'Missing initial value. You must have at least one value.'
      }, {
        validator: vals => !vals[0].startDate,
        message: 'Invalid initial value. The first value must not have a start date.'
      }, {
        validator: vals => {
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
      }
    ]
  };

};