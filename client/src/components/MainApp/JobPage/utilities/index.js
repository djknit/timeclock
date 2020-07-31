import moment from 'moment';

export * from '../../utilities';

function getWeekBeginsText(weekBeginsValue) {
  return moment().day(weekBeginsValue).format('dddd');
}

function getDayCutoffText(dayCutoffValue) {
  const _cutoffValue = dayCutoffValue || 0;
  const cutoffInMinutes = Math.floor((_cutoffValue / (1000 * 60)) + .5);
  const isCutoffNegative = cutoffInMinutes < 0;
  const cutoffDisplayHours = Math.floor(Math.abs(cutoffInMinutes) / 60);  
  const cutoffDisplayMinutes = Math.abs(cutoffInMinutes) % 60;
  const minutesPerDay = 24 * 60;
  const cutoffTimeInMinutes = (cutoffInMinutes + minutesPerDay) % minutesPerDay;
  const cutoffTime = {
    hours: (Math.floor(cutoffTimeInMinutes / 60) % 12) || 12, // should translate from 24hr style to AM/PM style
    minutes: cutoffTimeInMinutes % 60,
    isPm: cutoffTimeInMinutes >= 12 * 60
  };
  let result = `${isCutoffNegative ? '-' : '+'} ${cutoffDisplayHours} hr.`;
  if (cutoffDisplayMinutes) result += `, ${cutoffDisplayMinutes} min.`;
  result += ` (${cutoffTime.hours}:${cutoffTime.minutes < 10 ? '0' : ''}${cutoffTime.minutes} ${cutoffTime.isPm ? 'PM' : 'AM'})`;
  return result;
}

function getSimpleJobSettingValueText(settingName, value) {
  switch (settingName) {
    case 'dayCutoff':
      return getDayCutoffText(value);
    case 'weekBegins':
      return getWeekBeginsText(settingName, value);
    case 'timezone':
      return value;
  }
}

export { getDayCutoffText, getWeekBeginsText, getSimpleJobSettingValueText };