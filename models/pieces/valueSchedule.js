const mongoose = require('mongoose');

const dateSubdocFactory = require('./date');

module.exports = (valueOutline, options) => {

  const valDatePairSchema = new mongoose.Schema(
    {
      value: valueOutline,
      startDate: dateSubdocFactory()
    },
    { _id: false }
  );

  return {
    type: [valDatePairSchema],
    validate: [
      {
        validator: vals => {
          const isRequired = options && options.required;
          if (!isRequired) return true;
          if (vals.length === 0) return false;
          return true;
        },
        message: 'Missing initial value. You must have at least one value.'
      }, {
        validator: vals => {
          const firstVal = vals[0];
          if (!firstVal) return true;
          if (firstVal.startDate) return false;
          return true;
        },
        message: 'Invalid initial value. The first value must not have a start date.'
      }, {
        validator: vals => {
          for (let i = 1; i < vals.length; i++) {
            if (!vals[i].startDate) return false;
          }
          return true;
        },
        message: 'Missing date. All values in schedule except for the first must have a date.'
      }, {
        validator: vals => {
          if (vals.length < 3) return true;
          let previousDateTime;
          for (let i = 1; i < vals.length; i++) {
            const { startDate } = vals[i];
            if (!startDate) return false;
            const { year, month, day } = startDate;
            const valDateTime = new Date(year, month, day).getTime();
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