const moment = require('moment-timezone');

module.exports =  () => ({
  type: String,
  validate: {
    validator: value => moment.tz.zone(value) !== null,
    message: 'Invalid timezone'
  },
  required: true
});