import moment from 'moment-timezone';
import { dates as dateUtils } from '../../utilities';
import { cloneMyDate } from './elemental';
import getDateRangeInfo from './getDateRangeInfo';
import processData from './processData';
export * from '../../utilities';
export * from './wage';
export * from './earnings';

const {
  convertMomentToMyDate, isDateInRange
} = dateUtils;

function getDateFromUtcDateTime(utcDateTime) {
  return convertMomentToMyDate(moment.utc(utcDateTime));
}

export {
  getDateFromUtcDateTime,
  cloneMyDate,
  isDateInRange,
  getDateRangeInfo,
  processData
};
