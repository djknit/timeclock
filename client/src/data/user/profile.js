import { dataServiceFactory } from '../utilities';

let state = {
  hasUser: false,
  username: undefined,
  email: undefined
};

const service = dataServiceFactory({
  readFunction: () => (
    state.hasUser ?
    {
      username: state.username,
      email: state.email
    } :
    undefined
  ),
  setFunction: user => {
    state.hasUser = true;
    state.username = user.username;
    state.email = user.email;
  },
  clearFunction: () => {
    state.hasUser = false;
    state.username = state.email = undefined;
  }
});

export default service;