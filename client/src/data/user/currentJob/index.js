import { dataServiceFactory } from '../../utilities';
import jobsService from '../jobs';
import basicsService from './basics';
import timeService from './time';
import { getDateRangeInfo } from './time';
import settingsService from './settings';

const childDataServices = {
  currentJobBasics: basicsService,
  time: timeService,
  settings: settingsService
};

let state = { isCurrentJobSet: false };

function setCurrentJob(jobData) {
  state.isCurrentJobSet = true;
  basicsService.setValue(jobData);
  settingsService.setValue(jobData);
  timeService.setValue(jobData.weeks);
}

const currentJobService = dataServiceFactory({
  state,
  readFunction: () => {
    const { isCurrentJobSet, currentJobBasics, time, settings } = state;
    return isCurrentJobSet ? (
      { ...currentJobBasics, ...settings, time }
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

currentJobService.getInfoForDateRange = function (firstDate, lastDate) {
  const processedWeeks = state.time && state.time.weeks;
  return getDateRangeInfo(firstDate, lastDate, processedWeeks);
};

export default currentJobService;

export {
  basicsService as currentJobBasicsService,
  settingsService as currentJobSettingsService,
  timeService as currentJobTimeService
};