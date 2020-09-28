// ABOUT THIS FILE:
// This file is for job basics only (name, _id, and startDate) for all of the user's job.

import { dataServiceFactory } from '../utilities';

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
      const { jobs } = state;
      for (let i = 0; i < jobs.length; i++) {
        if (jobs[i]._id.toString() === jobId.toString()) {
          jobs.splice(i, 1);
          return;
        }
      }
    }
  }
});

export default service;