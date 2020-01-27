const { Schema } = require('mongoose');

const {
  areDatesEquivalent, areWagesEquivalent, getMostRecentScheduleValueForDate, convertMomentToMyDate, getMoment
} = require('../../../utilities');

// const Day = require('../../Day');
// const Job = require('../../Job');

const daysSubdocFactory = () => ([{
  type: Schema.Types.ObjectId,
  ref: 'Day',
  validate: [
    {
      validator: dayIds => new Promise(
        (resolve, reject) => {
          let daysChecked = 0;
          for (let i = 0; i < dayIds.length; i++) {
            const Day = require('../../Day');
            Day.findById(dayIds[i])
            .then(day => {
              const { segments, date, startCutoff, endCutoff, timezone } = day;
              for (let j = 0; j < segments.length; j++) {
                const segment = segments[j];
                if (!areDatesEquivalent(segment.date, date)) reject(false);
                if (segment.dayStartCutoff !== startCutoff) reject(false);
                if (segment.dayEndCutoff !== endCutoff) reject(false);
                if (segment.timezone !== timezone) reject(false);
              }
              daysChecked++;
              if (daysChecked === dayIds.length) resolve(true);
            });
          }
        }
      ),
      message: 'Invalid time segment(s): segment data doesn\'t match day data on at least one segment for at least one day in this week.'
    }
  ]
}]);


module.exports = daysSubdocFactory;

// (resolve, reject) => {
//   if (dayIds.length === 0) return resolve(true);
//   Job.findById()
//   .then(job => {
//     let daysChecked = 0;
//     for (let i = 0; i < dayIds.length; i++) {
//       Day.findById(dayIds[i])
//       .then(day => {
//         const { date, startCutoff, endCutoff, timezone, wage } = day;
//         if (timezone !== getMostRecentScheduleValueForDate(date, job.timezone)) reject(false);
//         if (!areWagesEquivalent(wage, getMostRecentScheduleValueForDate(date, job.wage))) reject(false);
//         if (endCutoff !== getMostRecentScheduleValueForDate(date, job.dayCutoff)) reject(false);
//         const precedingDate = convertMomentToMyDate(getMoment(date).subtract(1, 'days'));
//         if (startCutoff !== getMostRecentScheduleValueForDate(precedingDate, job.dayCutoff)) reject(false);
//         daysChecked++;
//         if (daysChecked === dayIds.length) resolve(true);
//       });
//     }
//   });
// }