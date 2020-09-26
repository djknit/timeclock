import { dataServiceFactory } from '../utilities';
import isLoggedInService from './isLoggedIn';
import profileService from './profile';
import jobsService from './jobs';
import currentJobService from './currentJob';

const childDataServices = {
  isLoggedIn: isLoggedInService,
  profileInfo: profileService,
  jobs: jobsService,
  currentJob: currentJobService
};
const propNames = Object.keys(childDataServices);

let state = {};

function getValueFromChildService(propName) {
  state[propName] = childDataServices[propName].getValue();
}

propNames.forEach(getValueFromChildService);

let numSubServiceResponsesNeeded = 0; // used to keep `userService` from `_emit`ing after `setValue` is called until all values are set

const userService = dataServiceFactory({
  readFunction: () => {
    if (!state.isLoggedIn) return undefined;
    const { profileInfo, jobs, currentJob } = state;
    return { ...profileInfo, jobs, currentJob };
  },
  setFunction: user => {
    console.log('setting user')
    numSubServiceResponsesNeeded = 3;
    isLoggedInService.setValue(true);
    profileService.setValue(user);
    jobsService.setValue(user.jobs);
  },
  clearFunction: () => {
    isLoggedInService.setValue(false);
    profileService.clearValue();
    jobsService.clearValue();
    currentJobService.clearValue();
  }
});

propNames.forEach(propName => {
  childDataServices[propName].subscribe(() => {
    getValueFromChildService(propName);
    if (numSubServiceResponsesNeeded > 0) --numSubServiceResponsesNeeded;
    if (numSubServiceResponsesNeeded === 0) userService._emit();
  });
});

export default userService;

export {
  isLoggedInService,
  profileService,
  jobsService,
  currentJobService
};