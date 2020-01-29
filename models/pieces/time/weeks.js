const { Schema } = require('mongoose');

const Week = require('../../Week');

const dateSubdocFactory = require('../date');
const intSubdocFactory = require('../integer');
const daysSubdocFactory = require('./days');

const { getDateTime, getMoment, getUtcMoment } = require('../../../utilities');

const weekDataSchema = new Schema({
  document: {
    type: Schema.Types.ObjectId,
    ref: 'Week',
    required: true
  },
  firstDateUtcTime: intSubdocFactory({ required: true }),
  lastDateUtcTime: intSubdocFactory({ required: true })
}, {
  _id: false
});

const weekSchema = new Schema({
  data: {
    type: weekDataSchema,
    validate: {
      validator: weekData => new Promise(
        (resolve, reject) => {
          Week.findById(weekData.document)
          .then(weekDoc => {
            const { firstDateUtcTime, lastDateUtcTime } = weekData;
            const { firstDate, lastDate } = weekDoc.data;
            if (
              getUtcMoment(firstDate).valueOf() !== firstDateUtcTime ||
              getUtcMoment(lastDate).valueOf() !== lastDateUtcTime
            ) {
              return reject(false);
            }
            return resolve(true);
          });
        }
      ),
      message: 'Invalid week data. First date and/or last date in week document data doesn\'t match week array entry UTC date time.'
    }
  }
});

const weeksSubdocFactory = () => ({
  type: [weekSchema],
  validate: {
    validator(weeks) {
      let previousLastDateTime;
      for (let i = 0; i < weeks.length; i++) {
        if (i > 0 && weeks[i].data.firstDateUtcTime <= previousLastDateTime) {
          return false;
        }
        previousLastDateTime = weeks[i].data.lastDateUtcTime;
      }
      return true;
    },
    message: 'Invalid weeks: overlapping or incorrectly ordered weeks. Weeks must be in chronological order and cannot overlap.'
  }
});

module.exports =  weeksSubdocFactory;