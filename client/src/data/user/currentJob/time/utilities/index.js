import { dates as dateUtils } from '../../utilities';
import moment from 'moment-timezone';
export * from '../../utilities';

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

function getDurationInfo(durationInMsec) {
  const durationInSeconds = Math.round(durationInMsec / 1000);
  return {
    hours: Math.floor(durationInSeconds / (60 * 60)),
    minutes: Math.floor(durationInSeconds / 60) % 60,
    seconds: durationInSeconds % 60,
    durationInMsec
  };
}

export {
  getDateFromUtcDateTime,
  cloneMyDate,
  getTimeInfoFromUtcTime,
  getDurationInfo
};