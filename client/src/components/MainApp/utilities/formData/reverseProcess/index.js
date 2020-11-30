import { getDayCutoffTime, constants } from '../../../../utilities';
import { convertWageToFormData } from './wage';
export * from './wage';

const { minsPerHr } = constants

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


function convertDayCutoffToFormData(valueInMinutes) {
  if (!valueInMinutes && valueInMinutes !== 0) return;
  let result = getDayCutoffTime(valueInMinutes, true);
  // convert time to input value by adjusting time to satisfy: { abs(hour + minute) <= 12*minsPerHr }
  if (result.hour >= 12 && valueInMinutes !== 12 * minsPerHr) {
    result.hour -= 24;
  }
  result.is24hr = false;
  return result;
}
