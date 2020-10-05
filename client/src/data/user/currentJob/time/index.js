import { dataServiceFactory } from './utilities';
import processWeek from './processWeek';

let state = {
  weeks: undefined
};

const service = dataServiceFactory({
  readFunction() {
    console.log(state.weeks && state.weeks.map(processWeek))
    return state.weeks && state.weeks.map(processWeek);
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

export default service;