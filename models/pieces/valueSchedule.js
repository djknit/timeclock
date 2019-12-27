const mongoose = require('mongoose');

const dateSubdocFactory = require('./date');

module.exports = (valueOutline) => {
  
  const valDatePairsSchema = new mongoose.Schema([
    {
      value: valueOutline,
      startDate: dateSubdocFactory()
    }
  ]);

  return {
    type: valDatePairsSchema,
    validate: [
      {
        validator: vals => {
          const firstVal = vals[0];
          if (!firstVal) return false;
          if (firstVal.startDate) return false;
        },
        message: 'Invalid initial value. The first value must not have a start date. You must have at least one value.'
      },
      {
        validator: vals => {
          let previousDateTime = 0;
          for (let i = 0; i < vals.length; i++) {
            const { year, month, day } = vals[i].startDate;
            const valDateTime = new Date(year, month, day).getTime();
            if (valDateTime <= previousDateTime) {
              return false;
            }
            previousDateTime = valDateTime;
          }
          return true;
        },
        message: 'Schedule must be in chronological order.'
      }
    ]
  };

}