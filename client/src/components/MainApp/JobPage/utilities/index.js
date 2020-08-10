import moment from 'moment';

export * from '../../utilities';

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
  result += ` (${cutoffTime.hour}:${cutoffTime.minute < 10 ? '0' : ''}${cutoffTime.minute} ${cutoffTime.isPm ? 'PM' : 'AM'})`;
  return result;
}

function getDayCutoffTime(cutoffValueInMinutes, is24hr) {
  const minutesPerDay = 24 * 60;
  const cutoffTimeInMinutes = (cutoffValueInMinutes + minutesPerDay) % minutesPerDay;
  let time = {
    hour: Math.floor(cutoffTimeInMinutes / 60),
    minute: cutoffTimeInMinutes % 60,
    is24hr: !!is24hr
  };
  if (!is24hr) {
    time.isPm = time.hour >= 12;
    time.hour = (time.hour % 12) || 12;
  }
  console.log(time)
  return time;
}

function getTimeText({ hours, minutes, isPm }) {
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${isPm ? 'PM' : 'AM'}`;
}

function getSimpleJobSettingValueText(settingName, value) {
  switch (settingName) {
    case 'dayCutoff':
      return getDayCutoffText(value);
    case 'weekBegins':
      return getWeekBeginsText(value);
    case 'timezone':
      return value;
  }
}

export { getDayCutoffText, getDayCutoffTime, getWeekBeginsText, getSimpleJobSettingValueText };