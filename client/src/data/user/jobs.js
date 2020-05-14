// * This file is for job basics only (name, _id, and startDate) for all of the user's job. *

import { dataServiceFactory } from '../../utilities';

let jobs;

const service = dataServiceFactory({
  readFunction: () => jobs && [...jobs],
  methods: {

  }
});

export default service;