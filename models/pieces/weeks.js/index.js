const { Schema } = require('mongoose');

const dateSubdocFactory = require('../date');
const intSubdocFactory = require('../integer');
const daysSubdocFactory = require('./days');

const weekSchema = new Schema({
  days: daysSubdocFactory(),
  firstDate: dateSubdocFactory(),
  lastDate: dateSubdocFactory(),
  weekNumber: intSubdocFactory()
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