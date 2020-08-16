import { convertWageToFormData } from './wage';
import { getDayCutoffTime } from '../../elemental';
export * from './wage';

function convertSettingValueToFormData(scheduleValue, settingName) {
  switch (settingName) {
    case 'dayCutoff':
      return convertDayCutoffToFormData(scheduleValue);
    case 'wage':
      return convertWageToFormData(scheduleValue);
    default:
      return scheduleValue;
  }
}

export { convertSettingValueToFormData };

function convertDayCutoffToFormData(scheduleValue) {
  const valueInMinutes = Math.round(scheduleValue / (1000 * 60));
  let result = getDayCutoffTime(valueInMinutes, true);
  // convert time to input value by adjusting time to satisfy: { abs(hour + minute) <= 12*60 }
  if (result.hour >= 12 && valueInMinutes !== 12 * 60) {
    result.hour -= 24;
  }
  console.log(result)
  result.is24hr = false;
  return result;
}