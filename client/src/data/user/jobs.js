// ABOUT THIS FILE:
// This file is for job basics only (name, _id, and startDate) for all of the user's job.

import { dataServiceFactory } from '../../utilities';

let jobs;

const service = dataServiceFactory({
  readFunction: () => jobs && jobs.map(job => ({ ...job })),
  methods: {
    setJobs(_jobs) {
      jobs = _jobs.map(({ name, _id, startDate }) => ({ name, _id, startDate }));
    },
    clearJobs() {
      jobs = undefined;
    }
  }
});

export default service;