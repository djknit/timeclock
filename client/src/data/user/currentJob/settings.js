import { dataServiceFactory } from '../../utilities';

let isCurrentJobSet = false;
let timezone, wage, weekBegins, dayCutoff;

const service = dataServiceFactory({
  readFunction: () => (
    isCurrentJobSet ?
    { timezone, wage, weekBegins, dayCutoff } :
    undefined
  ),
  setFunction: job => {
    isCurrentJobSet = true;
    timezone = job.timezone;
    wage = job.wage;
    weekBegins = job.weekBegins;
    dayCutoff = job.dayCutoff;
  },
  clearFunction: () => {
    isCurrentJobSet = false;
    timezone = wage = weekBegins = dayCutoff = undefined;
  },
  methods: {
    setCurrentJob: (job) => {
      isCurrentJobSet = true;
      timezone = job.timezone;
      wage = job.wage;
      weekBegins = job.weekBegins;
      dayCutoff = job.dayCutoff;
    },
    clearCurrentJob: () => {
      isCurrentJobSet = false;
      timezone = wage = weekBegins = dayCutoff = undefined;
    }
  }
});

export default service;