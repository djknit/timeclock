import { dataServiceFactory } from './utilities';
import settingsService from '../settings';
import processData from './processData';
import getDateRangeInfo from './getDateRangeInfo';

let state = {
  weeks: undefined,
  settings: settingsService._getRawSchedules()
};

let service = dataServiceFactory({
  readFunction() {
    return processData(state.weeks, state.settings);
  },
  setFunction(weeksArray) {
    state.weeks = weeksArray.map(({ document }) => document);
  },
  clearFunction() {
    state.weeks = undefined;
  },
  methods: {
    updateWeek(updatedWeek) {
      const { weeks } = state;
      for (let i = 0; i < weeks.length; i++) {
        if (weeks[i]._id.toString() === updatedWeek._id.toString()) {
          weeks[i] = updatedWeek;
          return;
        }
      }
    }
  }
});

settingsService.subscribe(() => {
  state.settings = settingsService._getRawSchedules();
  service._emit();
});

service.getInfoForDateRange = function(firstDate, lastDate) {
  let processedWeeks = processData(state.weeks).weeks;
  return getDateRangeInfo(firstDate, lastDate, processedWeeks);
};

export default service;

export { getDateRangeInfo };