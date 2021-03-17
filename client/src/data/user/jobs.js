// ABOUT THIS FILE:
// This file is for job basics only (name, _id, and startDate) for all of the user's jobs.

import { dataServiceFactory } from '../utilities';
import { currentJobBasicsService } from './currentJob';

let state = { jobs: undefined };

const service = dataServiceFactory({
  readFunction: () => state.jobs && state.jobs.map(job => ({ ...job })),
  setFunction: _jobs => {
    state.jobs = _jobs.map(({ name, _id, startDate }) => ({ name, _id, startDate }));
  },
  clearFunction: () => {
    state.jobs = undefined;
  },
  methods: {
    removeJob(jobId) {
      const indexOfJobToRemove = findIndexOfJobById(jobId);
      if (indexOfJobToRemove === -1) return;
      state.jobs.splice(indexOfJobToRemove, 1);
    },
    updateJob({ _id, name, startDate } = {}) {
      if (!_id || !state.jobs) return;
      const jobToUpdate = state.jobs[findIndexOfJobById(_id)];
      if (!jobToUpdate) return;
      Object.assign(jobToUpdate, { name, startDate });
    }
  }
});

currentJobBasicsService.subscribe(function() {
  service.updateJob(currentJobBasicsService.getValue());
});

function findIndexOfJobById(jobId) {
  const { jobs } = state;
  for (const i in jobs) {
    if (jobs[i]._id.toString() === jobId.toString()) {
      return i;
    }
  }
  return -1;
}

export default service;