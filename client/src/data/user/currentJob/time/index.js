import {
  dataServiceFactory, guessUserTimezone, getDateRangeInfo, processData
} from './utilities';
import settingsService from '../settings';

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

const otherMethods = {
  getInfoForDateRange(firstDate, lastDate) {
    let processedWeeks = processData(state.weeks).weeks;
    return getDateRangeInfo({ firstDate, lastDate }, processedWeeks);
  },
  _setJobSetTime(weeksArray) { // special alternative to normal set function to wait for new settings value before emitting (for when setting whole job and not just time)
    setWeeks(weeksArray);
    state.sessionTimezone = guessUserTimezone();
    state.wasSessionTzGuessed = true;
  },
  getSessionTimezone() {
    return state.sessionTimezone;
  }
};

Object.assign(timeService, otherMethods);

export default timeService;
