import moment from 'moment';
import { getDayCutoffTime } from '../elemental';
import { getWageValueSummaryText } from './wage';

export * from './wage';

function getWeekBeginsText(weekBeginsValue) {
  return moment().day(weekBeginsValue).format('dddd');
}

function getDayCutoffText(dayCutoffValue) {
  const _cutoffValue = dayCutoffValue || 0;
  const cutoffInMinutes = Math.round(_cutoffValue / (1000 * 60));
  const isCutoffNegative = cutoffInMinutes < 0;
  const cutoffDisplayHours = Math.floor(Math.abs(cutoffInMinutes) / 60);
  const cutoffDisplayMinutes = Math.abs(cutoffInMinutes) % 60;
  const cutoffTime = getDayCutoffTime(cutoffInMinutes, false);
  let result = `${isCutoffNegative ? '-' : '+'} ${cutoffDisplayHours} hr`;
  if (cutoffDisplayMinutes) result += ` ${cutoffDisplayMinutes} min`;
  result += ` (${getTimeText(cutoffTime)})`;
  return result;
}

function getTimeText({ hour, minute, isPm }) {
  return `${hour}:${minute < 10 ? '0' : ''}${minute} ${isPm ? 'PM' : 'AM'}`;
}

function getSimpleJobSettingValueText(settingName, value) {
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

export { getSimpleJobSettingValueText };