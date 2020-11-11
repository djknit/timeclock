import { dataServiceFactory, convertDayCutoffToMinutes, processWage } from './utilities';

const settingNames = ['timezone', 'wage', 'weekBegins', 'dayCutoff'];

let state = {};
resetState();

const service = dataServiceFactory({
  readFunction: () => {
    if (!state.isCurrentJobSet) return null;
    const settingValueProcessors = {
      wage: processWage,
      dayCutoff: convertDayCutoffToMinutes
    };
    let processedSchedules = {};
    settingNames.forEach(sName => {
      processedSchedules[sName] = processValueSchedule(state[sName], settingValueProcessors[sName]);
    });
    return processedSchedules;
  },
  setFunction: job => {
    state.isCurrentJobSet = true;
    settingNames.forEach(sName => {
      state[sName] = job[sName];
    });
  },
  clearFunction: resetState
});

service._getRawSchedules = function () {
  if (!state.isCurrentJobSet) return undefined;
  let rawSchedCopies = {};
  settingNames.forEach(sName => {
    rawSchedCopies[sName] = (
      state[sName] &&
      state[sName].map(entry => ({ ...entry }))
    );
  });
  return rawSchedCopies;
};

export default service;


function resetState() {
    state.isCurrentJobSet = false;
    settingNames.forEach(sName => {
    state[sName] = undefined;
  });
}

function processValueSchedule(schedule, valueProcessor) {
  return schedule.map(
    entry => ({
      ...entry,
      value: valueProcessor ? valueProcessor(entry.value) : entry.value
    })
  );
}
