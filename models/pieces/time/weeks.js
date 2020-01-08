const { Schema } = require('mongoose');

const dateSubdocFactory = require('../date');
const intSubdocFactory = require('../integer');
const daysSubdocFactory = require('./days');

const { getDateTime, getMoment } = require('../../../utilities');

const weekSchema = new Schema({
  days: daysSubdocFactory(),
  firstDate: dateSubdocFactory(),
  lastDate: dateSubdocFactory(),
  weekNumber: intSubdocFactory()
});

const weekSubdocFactory = () => ({
  type: weekSchema,
  validate: [
    {
      validator(val) {
        const { days, firstDate, lastDate } = val;
        return days.length - 1 === getMoment(lastDate).diff(getMoment(firstDate), 'days');
      },
      message: 'Invalid days. This week is missing days.'
    }, {
      validator(val) {
        const { days, firstDate, lastDate } = val;
        const firstDateTime = getDateTime(firstDate);
        const lastDateTime = getDateTime(lastDate);
        for (let i = 0; i < days.length; i++) {
          const dateTime = getDateTime(days[i].date);
          if (dateTime < firstDateTime || dateTime > lastDateTime) return false;
        }
        return true;
      },
      message: 'Invalid days. This week contains days that do not fall within its timespan.'
    }
  ]
});

module.exports =  () => ({
  type: [weekSubdocFactory()]
});
