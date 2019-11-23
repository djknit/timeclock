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
    validate: {
      validator: vals => {
        let previousDateTime;
        for (let i = 0; i < vals.length; i++) {
          const { year, month, day } = vals[i].startDate;
          const valDate = new Date(year, month, day).getTime();
          if (i !== 0 && valDateTime <= previousDateTime) {
            return false;
          }
          previousDateTime = valDateTime;
        }
        return true;
      },
      message: 'Schedule must be in chronological order.'
    }
  };

}