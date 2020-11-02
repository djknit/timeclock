import { dates as dateUtils } from '../../utilities';
import moment from 'moment-timezone';
export * from '../../utilities';
export * from './wage';
export * from './dateRanges';
export * from './earnings';

const {
  convertMomentToMyDate,
} = dateUtils;

// console.log(dateUtils)

function getDateFromUtcDateTime(utcDateTime) {
  return convertMomentToMyDate(moment.utc(utcDateTime));
}

function cloneMyDate({ day, month, year }) {
  return { day, month, year };
}

function getTimeInfoFromUtcTime(utcTime, timezone) {
  const timeMoment = moment.tz(utcTime, timezone);
  return {
    time: {
      hour: timeMoment.hour(),
      minute: timeMoment.minute(),
      second: timeMoment.second(),
      is24hr: true
    },
    date: convertMomentToMyDate(timeMoment),
    timezone
  };
}

export {
  getDateFromUtcDateTime,
  cloneMyDate,
  getTimeInfoFromUtcTime
};