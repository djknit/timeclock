export * from '../../utilities';
export * from './formData';

function promiseToSetState(component, updatedState) {
  return new Promise(resolve => component.setState(updatedState, resolve));
}

const constants = {
  secondsToDelayRedirect: 2.7,
  stepSizeOfRedirectDelay: .3
};

export {
  promiseToSetState,
  constants
};