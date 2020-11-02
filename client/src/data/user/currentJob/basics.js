import {
  dataServiceFactory
} from './utilities';

let state = {};
resetState();

const service = dataServiceFactory({
  readFunction: () => state._id ? { ...state } : undefined,
  setFunction: ({ _id, name, startDate }) => {
    Object.assign(state, { name, startDate }, { _id: _id.toString() });
  },
  clearFunction: resetState
});

export default service;


function resetState() {
  state._id = state.name = state.startDate = undefined;
}
