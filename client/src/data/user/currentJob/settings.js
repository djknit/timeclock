import { dataServiceFactory } from '../../utilities';

let state = {
  isCurrentJobSet: false,
  timezone: undefined,
  wage: undefined,
  weekBegins: undefined,
  dayCutoff: undefined
}

const service = dataServiceFactory({
  readFunction: () => {
    const { isCurrentJobSet, timezone, wage, weekBegins, dayCutoff } = state;
    return isCurrentJobSet ? (
      { timezone, wage, weekBegins, dayCutoff }
    ) : (
      undefined
    );
  },
  setFunction: job => {
    state.isCurrentJobSet = true;
    state.timezone = job.timezone;
    state.wage = job.wage;
    state.weekBegins = job.weekBegins;
    state.dayCutoff = job.dayCutoff;
  },
  clearFunction: () => {
    state.isCurrentJobSet = false;
    state.timezone = state.wage = state.weekBegins = state.dayCutoff = undefined;
  }
});

export default service;