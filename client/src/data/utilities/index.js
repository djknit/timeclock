import dataServiceFactory from './dataServiceFactory';
export * from '../../utilities';

function getInitialValuesFromChildren(childDataServices) {
  let values = {};
  Object.keys(childDataServices).forEach(
    propName => {
      values[propName] = childDataServices[propName].getValue();
    }
  );
  return values;
}

function subscribeToChildren(childDataServices, parentState, parentService) {
  Object.keys(childDataServices).forEach(
    propName => {
      const childService = childDataServices[propName];
      childService.subscribe(() => {
        parentState[propName] = childService.getValue();
      });
    }
  );
}

export {
  dataServiceFactory,
  getInitialValuesFromChildren,
  subscribeToChildren
};