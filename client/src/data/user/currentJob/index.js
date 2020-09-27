import { dataServiceFactory } from '../../utilities';
import jobsService from '../jobs';
import basicsService from './basics';
import timeService from './time';
import settingsService from './settings';

const childDataServices = {
  currentJobBasics: basicsService,
  weeks: timeService,
  settings: settingsService
};
const propNames = Object.keys(childDataServices);

let state = { isCurrentJobSet: false };

function getValueFromChildService(propName) {
  state[propName] = childDataServices[propName].getValue();
}

let isCurrentJobSet = false;
propNames.forEach(getValueFromChildService);

let numSubServiceResponsesNeeded = 0; // used to keep `currentJobService` from `_emit`ing after `setValue` is called until all values are set

function setCurrentJob(jobData) {
  numSubServiceResponsesNeeded = 3;
  state.isCurrentJobSet = true;
  basicsService.setValue(jobData);
  settingsService.setValue(jobData);
  timeService.setWeeks(jobData.weeks);
}

const currentJobService = dataServiceFactory({
  state,
  readFunction: () => {
    const { currentJobBasics, weeks, settings } = state;
    return isCurrentJobSet ? (
      { ...currentJobBasics, ...settings, weeks }
    ) : (
      null
    )
  },
  setFunction: setCurrentJob,
  clearFunction: () => {
    isCurrentJobSet = false;
    basicsService.clearValue();
    settingsService.clearValue();
    timeService.clearWeeks();
  },
  methods: {
    updateCurrentJob(updatedJob) {
      setCurrentJob(updatedJob);
      let _jobs = jobsService.getValue();
      for (let i = 0; i < _jobs.length; i++) {
        if (_jobs[i]._id.toString() === updatedJob._id.toString()) {
          _jobs[i] = updatedJob;
          jobsService.setValue(_jobs);
          return;
        }
      }
    }
  }
});

propNames.forEach(propName => {
  childDataServices[propName].subscribe(() => {
    getValueFromChildService(propName);
    if (numSubServiceResponsesNeeded > 0) --numSubServiceResponsesNeeded;
    if (numSubServiceResponsesNeeded === 0) currentJobService._emit();
  });
});

export default currentJobService;

export {
  basicsService as currentJobBasicsService,
  settingsService as currentJobSettingsService,
  timeService as currentJobTimeService
};