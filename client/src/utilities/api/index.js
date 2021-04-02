import auth, { methodsNotExpectingLoggedIn } from './auth';
import jobs from './jobs';
import time from './time';
import { addCatchApiUnauthToGroupOfUtilFxns } from './catchUnauth';
export { setOnApiUnauthFxn, catchApiUnauthorized } from './catchUnauth';

const api = { auth, jobs, time };

for (const categoryName in api) {
  addCatchApiUnauthToGroupOfUtilFxns(api[categoryName]);
}

Object.assign(api.auth, methodsNotExpectingLoggedIn);

export default api;
