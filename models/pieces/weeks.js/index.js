const { Schema } = require('mongoose');

const dateSubdocFactory = require('../date');
const intSubdocFactory = require('../integer');

const weekSchema = new Schema({
  days: [{

  }],
  firstDate: dateSubdocFactory(),
  lastDate: dateSubdocFactory(),
  number: intSubdocFactory()
});

module.exports =  () => ({
  type: [weekSchema],
  validate: [
    {
      validator(vals) {
        
      },
      message: 'This week is missing days.'
    }, {
      validator(vals) {
        
      },
      message: 'This week contains days that do not fall within its timespan.'
    }
  ]
});

function getDateTime(myDate) {
  const { day, month, year } = myDate;
  const date = new Date(year, month, day);
  return date.getTime();
}