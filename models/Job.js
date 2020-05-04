const mongoose = require('mongoose');

const valueScheduleSubdocFactory = require('./pieces/valueSchedule');
const intSubdocFactory = require('./pieces/integer');
const timezoneSubdocFactory = require('./pieces/timezone');
const wageSubdocFactory = require('./pieces/wage');
const dayCutoffSubdocFactory = require('./pieces/dayCutoff');
const dateSubdocFactory = require('./pieces/date');
const weeksSubdocFactory = require('./pieces/time/weeks');

const Schema = mongoose.Schema;

const JobSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    timezone: valueScheduleSubdocFactory(
      timezoneSubdocFactory()
    ),
    wage: valueScheduleSubdocFactory(
      wageSubdocFactory()
    ),
    dayCutoff: valueScheduleSubdocFactory(
      dayCutoffSubdocFactory()
    ),
    weekBegins: valueScheduleSubdocFactory(
      intSubdocFactory({
        validate: {
          validator(value) {
            if (value < 0 || value > 6) return false;
            return true;
          },
          message: 'Invalid week cutoff. Must be an integer 0 - 6. Sunday is 0, Monday is 1, etc.'
        },
        default: 0
      })
    ),
    weeks: weeksSubdocFactory(),
    startDate: dateSubdocFactory(),
    effectiveStartDate: dateSubdocFactory(),
    punchClock: {
      timeIn: intSubdocFactory(),
      timeOut: intSubdocFactory()
    }
  }
);

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;