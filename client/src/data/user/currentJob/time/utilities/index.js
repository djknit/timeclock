import { dates as dateUtils } from '../../utilities';
import moment from 'moment-timezone';
export * from '../../utilities';
export * from './wage';
export * from './earnings';

const {
  convertMomentToMyDate, isDateInRange
} = dateUtils;

function getDateFromUtcDateTime(utcDateTime) {
  return convertMomentToMyDate(moment.utc(utcDateTime));
}

function cloneMyDate({ day, month, year }) {
  return { day, month, year };
}

export {
  getDateFromUtcDateTime,
  cloneMyDate,
  isDateInRange
};
