import { dates as dateUtils } from '../../utilities';
import moment from 'moment-timezone';
export * from '../../utilities';

const {
  convertMomentToMyDate
} = dateUtils;

// console.log(dateUtils)

function getDateFromUtcDateTime(utcDateTime) {
  return convertMomentToMyDate(moment.utc(utcDateTime));
}

function cloneMyDate({ day, month, year }) {
  return { day, month, year };
}

export {
  getDateFromUtcDateTime,
  cloneMyDate
};