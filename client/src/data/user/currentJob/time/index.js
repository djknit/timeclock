import { dataServiceFactory, getDateRangeInfo, processData } from './utilities';
import settingsService from '../settings';
import sessionTzDataStore from './sessionTzStore';

let state = {
  weeks: undefined,
  settings: settingsService._getRawSchedules()
};

let timeService = dataServiceFactory({
  readFunction: readTime,
  setFunction: setWeeks,
  clearFunction() {
    state.weeks = undefined;
    sessionTzDataStore._reset();
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
    setSessionTimezone: sessionTzDataStore._setValue
  }
});

settingsService.subscribe(() => {
  state.settings = settingsService._getRawSchedules();
  timeService._emit();
});

const otherMethods = {
  getInfoForDateRange(firstDate, lastDate) {
    return getDateRangeInfo({ firstDate, lastDate }, readTime().weeks);
  },
  _setJobSetTime(weeksArray) { // special alternative to normal set function to wait for new settings value before emitting (for when setting whole job and not just time)
    setWeeks(weeksArray);
    sessionTzDataStore._reset();
  },
  getSessionTimezone() {
    return { ...sessionTzDataStore };
  }
};

Object.assign(timeService, otherMethods);

export default timeService;

export { sessionTzDataStore };


function setWeeks(rawWeeksArray) {
  state.weeks = [ ...rawWeeksArray ];
}

function readTime() {
  const { weeks, settings } = state;
  if (!weeks || !settings) return;
  const { sessionTimezone, wasSessionTzGuessed } = sessionTzDataStore;
  return processData(weeks, settings, sessionTimezone, wasSessionTzGuessed);
}
