import {
  dates as dateUtils,
  formatMyDate,
  getDateRangeText,
  getSimpleJobSettingValueText
} from '../../utilities';

export * from '../../utilities';
export * from './getUpdateWarnings';

const { getPrecedingDate } = dateUtils;

function preprocessScheduleForDisplay(schedule, settingName) {
  return schedule.map(
    (entry, index) => {
      const { startDate, value } = entry;
      console.log(entry._id)
      const endDate = (
        index !== schedule.length - 1 ?
        getPrecedingDate(schedule[index + 1].startDate) :
        undefined
      );
      return {
        ...entry,
        endDate,
        startDateText: startDate && formatMyDate(startDate),
        startDateShortText: startDate && formatMyDate(startDate, 'MMM. D'),
        dateRangeText: getDateRangeText(startDate, endDate),
        dateRangeShortText: getDateRangeText(startDate, endDate, true),
        valueSimpleText: getSimpleJobSettingValueText(settingName, value)
      };
    }
  );
}

export {
  preprocessScheduleForDisplay
};