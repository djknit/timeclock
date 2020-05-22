// ABOUT THIS FILE:
// This file is for job basics only (name, _id, and startDate) for all of the user's job.

import { dataServiceFactory } from '../../utilities';

let jobs;

const service = dataServiceFactory({
  readFunction: () => jobs && [...jobs],
  methods: {
    setJobs(_jobs) {
      jobs = _jobs;
    },
    clearJobs() {
      jobs = undefined;
    }
  }
});

export default service;