import { dataServiceFactory } from './utilities';
import basicsService from './basics';
import timeService, { sessionTzDataStore } from './time';
import settingsService from './settings';

const childDataServices = {
  basics: basicsService,
  time: timeService,
  settings: settingsService,
};

let state = { isCurrentJobSet: false };

function setCurrentJob(jobData) {
  console.log('set current job')
  state.isCurrentJobSet = true;
  timeService._setJobSetTime(jobData.weeks);
  basicsService.setValue(jobData);
  settingsService.setValue(jobData);
}

const currentJobService = dataServiceFactory({
  state,
  readFunction: () => {
    const { isCurrentJobSet, basics, time, settings } = state;
    return isCurrentJobSet ? (
      { ...basics, settings, time }
    ) : (
      null
    );
  },
  setFunction: setCurrentJob,
  clearFunction: () => {
    console.error(new Error('clear current job'))
    state.isCurrentJobSet = false;
    basicsService.clearValue();
    settingsService.clearValue();
    timeService.clearValue();
  },
  methods: {
    updateCurrentJob: setCurrentJob // now unnecessary but already in use
  },
  childDataServices
});

export default currentJobService;

export {
  basicsService as currentJobBasicsService,
  settingsService as currentJobSettingsService,
  timeService as currentJobTimeService,
  sessionTzDataStore as currentJobSessionTzStore
};
