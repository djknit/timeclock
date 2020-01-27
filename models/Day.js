const mongoose = require('mongoose');
const { Schema } = mongoose;

const dayCutoffSubdocFactory = require('./pieces/dayCutoff');
const segmentsSubdocFactory = require('./pieces/time/segments');
const timezoneSubdocFactory = require('./pieces/timezone');
const wageSubdocFactory = require('./pieces/wage');
const dateSubdocFactory = require('./pieces/date');

const DaySchema = new Schema({
  data: {
    type: new Schema({
      startCutoff: dayCutoffSubdocFactory(false),
      endCutoff: dayCutoffSubdocFactory(false),
      segments: segmentsSubdocFactory(),
      timezone: timezoneSubdocFactory(),
      wage: wageSubdocFactory()
    }),
    validate: {
      validator(data) {
        return;
      },
      message: ''
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const Day = mongoose.model('Day', DaySchema);

module.exports = Day;