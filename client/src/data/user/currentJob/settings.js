import { dataServiceFactory, convertDayCutoffToMinutes, processWage } from './utilities';

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
    if (isCurrentJobSet) console.log({
      timezone: processValueSchedule(timezone),
      wage: processValueSchedule(wage, processWage),
      weekBegins: processValueSchedule(weekBegins),
      dayCutoff: processValueSchedule(dayCutoff, convertDayCutoffToMinutes)
    })
    return isCurrentJobSet ? (
      {
        timezone: processValueSchedule(timezone),
        wage: processValueSchedule(wage, processWage),
        weekBegins: processValueSchedule(weekBegins),
        dayCutoff: processValueSchedule(dayCutoff, convertDayCutoffToMinutes)
      }
    ) : (
      null
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

service._getRawSchedules = function () {
  return {
    timezone: _copySched(state.timezone),
    wage: _copySched(state.wage),
    weekBegins: _copySched(state.weekBegins),
    dayCutoff: _copySched(state.dayCutoff)
  };
  function _copySched(_sched) {
    return _sched && _sched.map(_obj => Object.assign({}, _obj));
  };
};

export default service;

function processValueSchedule(schedule, valueProcessor) {
  return schedule.map(
    entry => ({
      ...entry,
      value: valueProcessor ? valueProcessor(entry.value) : entry.value
    })
  );
}