const { Schema } = require('mongoose');

const Week = require('../../Week');

const intSubdocFactory = require('../integer');

const { getDateTime, getMoment, getUtcMoment } = require('../../../utilities');

const weekSchema = new Schema({
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

const weeksSubdocFactory = () => ({
  type: [weekSchema],
  validate: [
    {
      // Doesn't run on update; need additional check somewhere else.
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
    }, {
      validator: weeks => new Promise(
        (resolve, reject) => {
          console.log('weeks validator 2')
          let numCompleted = 0;
          for (let i = 0; i < weeks.length; i++) {
            const week = weeks[i];
            Week.findById(week.document)
            .then(weekDoc => {
              const { firstDateUtcTime, lastDateUtcTime } = week;
              const { firstDate, lastDate, days } = weekDoc;
              const docFirstDateUtcTime = getUtcMoment(firstDate).valueOf();
              const docLastDateUtcTime = getUtcMoment(lastDate).valueOf();
              if (
                docFirstDateUtcTime !== firstDateUtcTime ||
                docLastDateUtcTime !== lastDateUtcTime
              ) {
                return reject(new Error('Invalid week data. First date and/or last date in week document data doesn\'t match week array entry UTC date time.'));
              }
              const errMsg2 = 'Invalid day(s). Week is missing day(s) and/or contains day(s) that do not fall within its time range.';
              const expectedNumberOfDays = getMoment(lastDate).diff(getMoment(firstDate), 'days') + 1;
              if (days.length !== expectedNumberOfDays) {
                return reject(new Error(errMsg2));
              }
              for (let j = 0; j < days.length; j++) {
                const dayUtcTime = getUtcMoment(days[j].date).valueOf();
                if (dayUtcTime < firstDateTime || dayUtcTime > lastDateTime) {
                  return reject(new Error(errMsg2));
                }
              }
              if (++numCompleted === weeks.length) {
                return resolve(true);
              }
            });
          }
        }
      ),
      message: function(props) {
        return props.reason.message;
      }
    }, {
      validator(weeks) {
          console.log('weeks validator 3')
        for (let i = 0; i < weeks.length; i++) {
          const week = weeks[i];
          if (week.firstDateUtcTime > week.lastDateUtcTime) {
            return false;
          }
        }
        return true;
      },
      message: 'Invalid `firstDate`/`lastDate` combination for week. First date must not come after last date.'
    }
  ]
});

module.exports =  weeksSubdocFactory;