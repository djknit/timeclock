import { dataServiceFactory } from '../utilities';

let isLoggedIn = false;

const service = dataServiceFactory({
  readFunction: () => isLoggedIn,
  setFunction: newValue => {
    isLoggedIn = newValue;
  }
});

export default service;