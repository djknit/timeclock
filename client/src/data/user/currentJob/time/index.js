import { dataServiceFactory } from './utilities';
import processData from './processData';

let state = {
  weeks: undefined
};

let service = dataServiceFactory({
  readFunction() {
    return processData(state.weeks);
  },
  setFunction(weeksArray) {
    state.weeks = weeksArray.map(({ document }) => document);
  },
  clearFunction() {
    state.weeks = undefined;
  },
  methods: {
    updateWeek(updatedWeek) {
      const { weeks } = state;
      for (let i = 0; i < weeks.length; i++) {
        if (weeks[i]._id.toString() === updatedWeek._id.toString()) {
          weeks[i] = updatedWeek;
          return;
        }
      }
    }
  }
});

service.getTimeInDateRange = function(firstDate, lastDate) {
  
};

export default service;
