export * from '../../utilities';

function promiseToSetState(component, updatedState) {
  return new Promise(resolve => component.setState(updatedState, resolve));
}

export { promiseToSetState };