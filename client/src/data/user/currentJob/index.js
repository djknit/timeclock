import { dataServiceFactory } from '../../../utilities';
import timeService from './time';

let weeks = timeService.getValue();
timeService.subscribe(() => weeks = timeService.getValue());

let id, name, timezone, wage, dayCutoff, weekBegins;

const service = dataServiceFactory({
  readFunction: () => (
    id ?
    { id, name, timezone, wage, dayCutoff, weekBegins } :
    null
  ),
  methods: {
    setCurrentJob(currentJob) {
      id = currentJob._id.toString();
      name = currentJob.name;
      timezone = currentJob.timezone;
      wage = currentJob.wage;
      dayCutoff = currentJob.dayCutoff;
      weekBegins = currentJob.weekBegins;
    },
    clearCurrentJob() {
      id = name = timezone = wage = dayCutoff = weekBegins = undefined;
    }
  }
});

export default service;