import axios from 'axios';

function createAxiosInstance(path) {
  return axios.create({
    baseURL: `/api/${path}`
  });
}

// let _onApiUnauthorized;

// function setOnApiUnauthFxn(onApiUnauthorized) {
//   _onApiUnauthorized = onApiUnauthorized;
// }

// function addCatchApiUnauthToApiUtilFxn(apiUtilFunction) {
//   if (!_onApiUnauthorized) return apiUtilFunction;
//   return function(...args) {
//     return apiUtilFunction(...args)
//     .catch(err => {
//       if (err && err.response && err.response.status === 401) {
//         _onApiUnauthorized();
//         return true;
//       }
//       throw err;
//     });
//   };
// }

export {
  createAxiosInstance
};