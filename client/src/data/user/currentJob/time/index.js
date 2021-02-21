import { dataServiceFactory, guessUserTimezone } from './utilities';
import settingsService from '../settings';
import processData from './processData';
import getDateRangeInfo from './getDateRangeInfo';

let state = {
  weeks: undefined,
  settings: settingsService._getRawSchedules(),
  sessionTimezone: guessUserTimezone(),
  wasSessionTzGuessed: true
};

function setWeeks(rawWeeksArray) {
  state.weeks = [ ...rawWeeksArray ];
}

let timeService = dataServiceFactory({
  readFunction() {
    const { weeks, settings, sessionTimezone, wasSessionTzGuessed } = state;
    if (!weeks || !settings) return;
    const timezone = sessionTimezone;
    return processData(weeks, settings, timezone, wasSessionTzGuessed);
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
      state.wasSessionTzGuessed = false;
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
timeService._setJobSetTime = function (weeksArray) {
  setWeeks(weeksArray);
  state.sessionTimezone = guessUserTimezone();
};

timeService.getSessionTimezone = function() {
  return state.sessionTimezone || guessUserTimezone();
};

export default timeService;
