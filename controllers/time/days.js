const moment = require('moment-timezone');

const DayController = require('../Day');

const {
  getMostRecentScheduleIndexForDate,
  getMostRecentScheduleValueForDate,
  convertMomentToMyDate,
  areDatesEquivalent,
  getFirstDayOfWeekForDate,
  findWeekBeginsSchedIndexForDate,
  getMoment
} = require('../../utilities');

module.exports = {
  createDocsForDays: days => new Promise(
    (resolve, reject) => {
    console.log('- - - CREATE DOCS FOR DAYS - - -')
    console.log(days)
    console.log('days ^ ^ ^')
    if (days.length === 0) return resolve([]);
      let daysProcessed = 0;
      days.forEach((day, index, arr) => {
        DayController.create(day)
        .then(dayDoc => {
          arr[index] = dayDoc;
          daysProcessed++;
          if (daysProcessed === days.length) {
            // console.log('--------(------(-----------')
            // console.log(arr);
            return resolve(arr);
          }
        });
      });
    }
  )
};