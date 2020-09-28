import { dataServiceFactory } from '../utilities';

let state = { isLoggedIn: false };

const service = dataServiceFactory({
  readFunction: () => state.isLoggedIn,
  setFunction: newValue => {
    state.isLoggedIn = newValue;
  }
});

export default service;