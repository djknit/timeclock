const { Schema } = require('mongoose');

const dayCutoffSubdocFactory = require('../dayCutoff');
const segmentsSubdocFactory = require('./segments');

const daySchema = new Schema({
  startCutoff: dayCutoffSubdocFactory(false),
  endCutoff: dayCutoffSubdocFactory(false),
  segments: segmentsSubdocFactory()
});


module.exports =  () => ({
  type: String,
  validate: {
    validator: value => moment.tz.zone(value) !== null,
    message: 'Invalid timezone'
  },
  required: true
});