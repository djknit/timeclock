const { Schema } = require('mongoose');

const { areDatesEquivalent, areWagesEquivalent } = require('../../../utilities');

const Day = require('./Day');
const dayCutoffSubdocFactory = require('../dayCutoff');
const segmentsSubdocFactory = require('./segments');
const timezoneSubdocFactory = require('../timezone');
const wageSubdocFactory = require('../wage');
const dateSubdocFactory = require('../date');

// const daySchema = new Schema({
//   date: dateSubdocFactory({ required: true }),
//   startCutoff: dayCutoffSubdocFactory(false),
//   endCutoff: dayCutoffSubdocFactory(false),
//   segments: segmentsSubdocFactory(),
//   timezone: timezoneSubdocFactory(),
//   wage: wageSubdocFactory()
// });

// daySchema.path('segments').validate(
//   segments => {
//     console.log('*%*%'.repeat(20))
//     console.log(this)
//     console.log('*%*%'.repeat(20))
//     let previousEndTime;
//     for (let i = 0; i < segments.length; i++) {
//       if (i > 0 && segments[i].startTime < previousEndTime) {
//         return false;
//       }
//       previousEndTime = segments[i].endTime;
//     }
//     return true;
//   },
//   'Invalid segments: overlapping. Time segments may not overlap.'
// );

const daysSubdocFactory = () => ({
  type: [Schema.Types.ObjectId],
  ref: 'Day',
  validate: [
    {
      validator: dayIds => {
        for (let i = 0; i < dayIds.length; i++) {
          Day.findById(dayIds[i])
            .then(day => {
              if (!day) throw new Error('day not found');
              const { segments, date, startCutoff, endCutoff, timezone, wage } = day;
              for (let j = 0; j < segments.length; j++) {
                const segment = segments[j];
                if (!areDatesEquivalent(date, segments[j].date)) return false;
                if (segment.dayStartCutoff !== startCutoff) return false;
                if (segment.dayEndCutoff !== endCutoff) return false;
                if (segment.timezone !== timezone) return false;
                if (!areWagesEquivalent(segment.wage, wage)) return false;
              }
            });
        }
        return true;
      },
      message: 'Invalid time segment(s): segment data doesn\'t match day data on at least one segment for this day.'
    }, {
      validator: val => {
        console.log('7'.repeat(30));
        console.log(val);
      },
      message: props => {
        console.log(props);
        return true;
      }
    }
  ]
});


module.exports = daysSubdocFactory;