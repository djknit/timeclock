import { dataServiceFactory } from '../../../utilities';
import timeService from './time';
import jobsService from '../jobs';
import { jobs } from '../../../utilities/api';

let weeks = timeService.getValue();
timeService.subscribe(() => weeks = timeService.getValue());

let id, name, timezone, wage, dayCutoff, weekBegins;

function setCurrentJob(currentJob) {
  id = currentJob._id.toString();
  name = currentJob.name;
  timezone = currentJob.timezone;
  wage = currentJob.wage;
  dayCutoff = currentJob.dayCutoff;
  weekBegins = currentJob.weekBegins;
}

const service = dataServiceFactory({
  readFunction: () => (
    id ?
    { id, name, timezone, wage, dayCutoff, weekBegins } :
    null
  ),
  methods: {
    setCurrentJob,
    clearCurrentJob() {
      id = name = timezone = wage = dayCutoff = weekBegins = undefined;
    },
    updateCurrentJob(updatedJob) {
      setCurrentJob(updatedJob);
      let _jobs = jobsService.getValue();
      for (let i = 0; i < _jobs.length; i++) {
        if (_jobs[i]._id.toString() === updatedJob._id.toString()) {
          _jobs[i] = updatedJob;
          jobsService.setJobs(_jobs);
          return;
        }
      }
    }
  }
});

export default service;