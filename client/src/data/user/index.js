import { dataServiceFactory } from '../../utilities';
import isLoggedInService from './isLoggedIn';
import profileService from './profile';
import jobsService from './jobs';
import currentJobService from './currentJob';

let isLoggedIn = isLoggedInService.getValue();
let profileInfo = profileService.getValue();
let jobs = jobsService.getValue();
let currentJob = currentJobService.getValue();

const userService = dataServiceFactory({
  readFunction: () => {
    if (!isLoggedIn) return undefined;
    return { ...profileInfo, jobs, currentJob };
  },
  methods: {
    setUser(user) {
      isLoggedInService.setValue(true);
      profileService.setUser(user);
      jobsService.setJobs(user.jobs);
    },
    clearUser() {
      isLoggedInService.setValue(false);
      profileService.clearUser();
      jobsService.clearJobs();
      currentJobService.clearCurrentJob();
    }
  }
});

isLoggedInService.subscribe(() => {
  isLoggedIn = isLoggedInService.getValue();
  userService._emit();
});
profileService.subscribe(() => {
  profileInfo = profileService.getValue();
  userService._emit();
});
jobsService.subscribe(() => {
  jobs = jobsService.getValue();
  userService._emit();
});
currentJobService.subscribe(() => {
  currentJob = currentJobService.getValue();
  userService._emit();
});

export default userService;

export {
  isLoggedInService,
  profileService,
  jobsService,
  currentJobService
};