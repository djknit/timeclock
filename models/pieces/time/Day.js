const { Schema } = require('mongoose');

const dayCutoffSubdocFactory = require('../dayCutoff');
const segmentSubdocFactory = require('./segments');
const timezoneSubdocFactory = require('../timezone');
const wageSubdocFactory = require('../wage');
const dateSubdocFactory = require('../date');

const daySchema = new Schema({
  date: dateSubdocFactory({ required: true }),
  startCutoff: dayCutoffSubdocFactory(false),
  endCutoff: dayCutoffSubdocFactory(false),
  segments: [segmentSubdocFactory()],
  timezone: timezoneSubdocFactory(),
  wage: wageSubdocFactory()
});