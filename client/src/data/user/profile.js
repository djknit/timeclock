import { dataServiceFactory } from '../utilities';

let username, email;
let hasUser = false;

const service = dataServiceFactory({
  readFunction: () => (
    hasUser ?
    { username, email } :
    undefined
  ),
  setFunction: user => {
    hasUser = true;
    username = user.username;
    email = user.email;
  },
  clearFunction: () => {
    hasUser = false;
    username = email = undefined;
  }
});

export default service;