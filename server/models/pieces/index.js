const { segmentSchema } = require('./time');

module.exports = {
  intSubdocFactory: require('./integer'),
  dateSubdocFactory: require('./date'),
  dayCutoffSubdocFactory: require('./dayCutoff'),
  timezoneSubdocFactory: require('./timezone'),
  valueScheduleSubdocFactory: require('./valueSchedule'),
  wageSubdocFactory: require('./wage'),
  segmentSchema
};
