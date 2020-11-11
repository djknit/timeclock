import moment from 'moment';
import {
  dates as dateUtils,
  getDayCutoffTime,
  constants
} from '../../../utilities';
// import { getDayCutoffTime } from '../elemental';
import { getWageValueSummaryText } from './wage';
import { convertStringToNonbreakingHtml } from './textFormatting';

export * from './wage';
export * from './textFormatting';

const { minsPerHr } = constants;

function formatMyDate(myDate, formatString, isString) {
  const stringResult = dateUtils.getMoment(myDate || {}).format(formatString || 'MMM. D, YYYY') || '';
  return isString ? stringResult : convertStringToNonbreakingHtml(stringResult);
}

function getWeekBeginsText(weekBeginsValue) {
  return moment().day(weekBeginsValue).format('dddd');
}

function getDayCutoffText(dayCutoffValue) {
  // cutoff value is in minutes
  const isCutoffNegative = dayCutoffValue < 0;
  const cutoffDisplayHours = Math.floor(Math.abs(dayCutoffValue) / minsPerHr);
  const cutoffDisplayMinutes = Math.abs(dayCutoffValue) % minsPerHr;
  const cutoffTime = getDayCutoffTime(dayCutoffValue, false);
  let result = `${isCutoffNegative ? '-' : '+'} ${cutoffDisplayHours} hr`;
  if (cutoffDisplayMinutes) result += ` ${cutoffDisplayMinutes} min`;
  result += ` (${getTimeText(cutoffTime)})`;
  return result;
}

function getTimeText({ hour, minute, isPm }) {
  return `${hour}:${minute < 10 ? '0' : ''}${minute} ${isPm ? 'PM' : 'AM'}`;
}

function getSimpleJobSettingValueText(settingName, value) {
  if (!value && value !== 0) {
    return 'none';
  }
  switch (settingName) {
    case 'dayCutoff':
      return getDayCutoffText(value);
    case 'weekBegins':
      return getWeekBeginsText(value);
    case 'timezone':
      return value;
    case 'wage':
      return getWageValueSummaryText(value);
    default:
      throw new Error('missing or invalid setting name')
  }
}

export {
  formatMyDate,
  getSimpleJobSettingValueText
};