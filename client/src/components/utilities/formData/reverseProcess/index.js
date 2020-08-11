import { convertWageToFormData } from './wage';
import { getDayCutoffTime } from '../../elemental';
export * from './wage';

function convertSettingValueToFormData(scheduleValue, settingName) {
  switch (settingName) {
    case 'dayCutoff':
      const valueInMinutes = Math.round(scheduleValue / (1000 * 60));
      return getDayCutoffTime(valueInMinutes, true);
    case 'wage':
      console.log('CONVERTING WAGE TO FORM DATA')
      console.log(convertSettingValueToFormData(scheduleValue))
      return convertWageToFormData(scheduleValue);
    default:
      return scheduleValue;
  }
}
export { convertSettingValueToFormData };