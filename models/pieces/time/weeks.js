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

const weeksSubdocFactory = () => ({
  type: weekSchema,
  validate: [
    {
      validator(val) {
        console.log(' pink pig -'.repeat(6));
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
    }, {
      validator(val) {
        const { days } = val;
        let previousDateTime;
        for (let i = 0; i < days.length; i++) {
          const { day, month, year } = days[i].date;
          const dateTime = new Date(year, month, day).getTime();
          if (i > 0 && dateTime <= previousDateTime) return false;
          previousDateTime = dateTime;
        }
        return true;
      },
      message: 'Invalid days array. Days must be in chronological order and cannot be duplicated.'
    }
  ]
});

module.exports =  weeksSubdocFactory