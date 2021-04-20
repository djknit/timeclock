import { dataServiceFactory } from '../utilities';
import isLoggedInService from './isLoggedIn';
import profileService from './profile';
import jobsService from './jobs';
import currentJobService from './currentJob';

export * from './currentJob';

const childDataServices = {
  isLoggedIn: isLoggedInService,
  profileInfo: profileService,
  jobs: jobsService,
  currentJob: currentJobService
};

let state = {};

const userService = dataServiceFactory({
  readFunction: () => {
    if (!state.isLoggedIn) return undefined;
    const { profileInfo, jobs, currentJob } = state;
    return { ...profileInfo, jobs, currentJob };
  },
  setFunction: user => {
    if (isChangingUser(user)) currentJobService.clearValue();
    else currentJobService._emit(); // to make num subservice responses equal num child services
    isLoggedInService.setValue(true);
    profileService.setValue(user);
    jobsService.setValue(user.jobs);
  },
  clearFunction: () => {
    isLoggedInService.setValue(false);
    profileService.clearValue();
    jobsService.clearValue();
    currentJobService.clearValue();
  },
  state,
  childDataServices
});

export default userService;

export {
  isLoggedInService,
  profileService,
  jobsService,
  currentJobService
};


function isChangingUser(newUserData) {
  return (
    state.isLoggedIn &&
    (
      !newUserData ||
      (
        newUserData.username !== state.profileInfo.username &&
        newUserData.email !== state.profileInfo.email
      )
    )
  );
}
