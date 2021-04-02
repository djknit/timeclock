let _onApiUnauthorized;

function setOnApiUnauthFxn(onApiUnauthorized) {
  _onApiUnauthorized = onApiUnauthorized;
}

function catchApiUnauthorized(err) {
  if (err && err.response && err.response.status === 401 && _onApiUnauthorized) {
    _onApiUnauthorized();
  }
  throw err;
}

function addCatchApiUnauthToApiUtilFxn(apiUtilFunction) {
  return function(...args) {
    return apiUtilFunction(...args).catch(catchApiUnauthorized);
  };
}

function addCatchApiUnauthToGroupOfUtilFxns(apiUtilsObj = {}) {
  for (const methodName in apiUtilsObj) {
    apiUtilsObj[methodName] = addCatchApiUnauthToApiUtilFxn(apiUtilsObj[methodName]);
  }
}

export {
  setOnApiUnauthFxn,
  catchApiUnauthorized,
  addCatchApiUnauthToGroupOfUtilFxns
};
