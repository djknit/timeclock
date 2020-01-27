const { Schema } = require('mongoose');

const {
  areDatesEquivalent, areWagesEquivalent, getMostRecentScheduleValueForDate, convertMomentToMyDate, getMoment
} = require('../../../utilities');

// const Day = require('../../Day');
// const Job = require('../../Job');

const daysSubdocFactory = () => ([{
  type: Schema.Types.ObjectId,
  ref: 'DayData',
  validate: {
    validator(data) {
      const { startCutoff, endCutoff, segments, timezone, date } = data
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        if (
          segment.dayStartCutoff !== startCutoff ||
          segment.dayEndCutoff !== endCutoff ||
          segment.timezone !== timezone ||
          !areDatesEquivalent(segment.date, date)
        ) return false;
      }
      return true;
    },
    message: 'Segment data does not match day data for at least one segment on this day.'
  }
}]);

module.exports = daysSubdocFactory;