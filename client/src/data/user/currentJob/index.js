import { dataServiceFactory, guessUserTimezone } from './utilities';
import jobsService from '../jobs';
import basicsService from './basics';
import timeService from './time';
import settingsService from './settings';

const childDataServices = {
  basics: basicsService,
  time: timeService,
  settings: settingsService,
};

let state = { isCurrentJobSet: false };

function setCurrentJob(jobData) {
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
    state.isCurrentJobSet = false;
    basicsService.clearValue();
    settingsService.clearValue();
    timeService.clearValue();
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
  },
  childDataServices
});

export default currentJobService;

export {
  basicsService as currentJobBasicsService,
  settingsService as currentJobSettingsService,
  timeService as currentJobTimeService
};