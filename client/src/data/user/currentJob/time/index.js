import { dataServiceFactory } from './utilities';
import settingsService from '../settings';
import processData from './processData';
import getDateRangeInfo from './getDateRangeInfo';

let state = {
  weeks: undefined,
  settings: settingsService._getRawSchedules(),
  isWaitingForSiblings: false
};

let service = dataServiceFactory({
  readFunction() {
    const { weeks, settings } = state;
    if (!weeks || !settings) return;
    return processData(weeks, settings);
  },
  setFunction(weeksArray) {
    state.isWaitingForSiblings = true;
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
  },
  checkIsWaitingForSibling() {
    return state.isWaitingForSibling;
  }
});

settingsService.subscribe(() => {
  const updatedSchedules = settingsService._getRawSchedules();
  state.settings = updatedSchedules;
  state.isWaitingForSiblings = false;
  if (updatedSchedules) {
    service._emit();
  }
});

service.getInfoForDateRange = function(firstDate, lastDate) {
  let processedWeeks = processData(state.weeks).weeks;
  return getDateRangeInfo({ firstDate, lastDate }, processedWeeks);
};

export default service;
