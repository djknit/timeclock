import { dataServiceFactory, guessUserTimezone } from './utilities';
import settingsService from '../settings';
import processData from './processData';
import getDateRangeInfo from './getDateRangeInfo';

let state = {
  weeks: undefined,
  settings: settingsService._getRawSchedules(),
  sessionTimezone: undefined
};

function setWeeks(rawWeeksArray) {
  state.weeks = rawWeeksArray.map(({ document }) => document);
}

let timeService = dataServiceFactory({
  readFunction() {
    const { weeks, settings, sessionTimezone } = state;
    if (!weeks || !settings) return;
    return processData(weeks, settings, sessionTimezone);
  },
  setFunction(weeksArray) {
    setWeeks(weeksArray);
  },
  clearFunction() {
    state.weeks = undefined;
    state.sessionTimezone = undefined;
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
    },
    setSessionTimezone(newTimezone) {
      state.sessionTimezone = newTimezone;
    }
  }
}); 

settingsService.subscribe(() => {
  state.settings = settingsService._getRawSchedules();
  timeService._emit();
});

timeService.getInfoForDateRange = function(firstDate, lastDate) {
  let processedWeeks = processData(state.weeks).weeks;
  return getDateRangeInfo({ firstDate, lastDate }, processedWeeks);
};

// special alternative to normal set function to wait for new settings value before emitting (for when setting whole job and not just time)
timeService.setJobSetTime = function(weeksArray) {
  setWeeks(weeksArray);
  state.sessionTimezone = guessUserTimezone();
};

export default timeService;
