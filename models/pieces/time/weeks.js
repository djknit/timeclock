const { Schema } = require('mongoose');

const dateSubdocFactory = require('../date');
const intSubdocFactory = require('../integer');
const daysSubdocFactory = require('./days');

const { getDateTime, getMoment } = require('../../../utilities');

const weekSchema = new Schema({
  days: daysSubdocFactory(),
  firstDate: dateSubdocFactory(),
  lastDate: dateSubdocFactory(),
  weekNumber: intSubdocFactory(),
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  }
});

const weeksSubdocFactory = () => ({
  type: [weekSchema],
  validate: [
    {
      validator(weeks) {
        let previousJobId;
        for (let i = 0; i < weeks.length; i++) {
          const jobId = weeks[i].job;
          if (i > 0 && jobId !== previousJobId) return false;
          previousJobId = jobId;
        }
        return true;
      },
      message: 'Invalid weeks. Job IDs must be the same for all weeks in array.'
    }, {
      validator: unpopulatedWeeks => new Promise(
        (resolve, reject) => {
          if (unpopulatedWeeks.length === 0) resolve(true);
          const Job = require('../../Job');
          // console.log(Job);
          // console.log(Job.findById)
          // console.log(unpopulatedWeeks);
      // Needs work potentially. Should probably look up with Day instead of Job b/c job is probably not updated yet when validator runs.
          Job.findById(unpopulatedWeeks[0].job)
          .select('weeks')
          .populate('weeks.days')
          .then(({ weeks }) => {
            for (let i = 0; i < weeks.length; i++) {
              const { days, firstDate, lastDate } = weeks[i];
              if (days.length !== getMoment(lastDate).diff(getMoment(firstDate), 'days') + 1) {
                return reject(false);
              }
              const firstDateTime = getDateTime(firstDate);
              const lastDateTime = getDateTime(lastDate);
              let previousDateTime;
              for (let j = 0; j < days.length; j++) {
                const dateTime = getDateTime(days[j].date);
                if (dateTime < firstDateTime || dateTime > lastDateTime) return reject(false);
                if (j > 0 && dateTime <= previousDateTime) return reject(false);
                previousDateTime = dateTime;
              }
            }
            resolve(true);
          });
        }
      ),
      message: 'Invalid days. At least one week is either missing days, contains days that do not fall within its timespan, contains duplicate days, or has incorrectly ordered days. Days must be in chronological order, cannot be duplicated, and must cover the complete timespan of the week.'
    }, {
      validator(weeks) {
        let previousLastDateTime;
        for (let i = 0; i < weeks.length; i++) {
          if (i > 0 && getDateTime(weeks[i].firstDate) <= previousLastDateTime) {
            return false;
          }
          previousLastDateTime = getDateTime(weeks[i].lastDate);
        }
        return true;
      },
      message: 'Invalid weeks: overlapping or incorrectly ordered weeks. Weeks must be in chronological order and cannot overlap.'
    }
  ]
});

module.exports =  weeksSubdocFactory;