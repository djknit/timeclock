import { dataServiceFactory } from '../../utilities';
import jobsService from './jobs';
import currentJobService from './currentJob';

let jobs = jobsService.getValue();
jobsService.subscribe(() => {
  jobs = jobsService.getValue();
});

let currentJob = currentJobService.getValue();
currentJobService.subscribe(() => {
  currentJob = currentJobService.getValue();
});

let username, email, _id;
let isLoggedIn = false;

const userService = dataServiceFactory({
  readFunction: () => (
    isLoggedIn ?
    {
      username,
      email,
      _id,
      jobs,
      currentJob
    } :
    null
  ),
  methods: {

  }
});

return userService;