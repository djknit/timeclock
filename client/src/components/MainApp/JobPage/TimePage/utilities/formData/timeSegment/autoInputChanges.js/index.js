import { afterTimeInputChange } from './times';

function performAutoChangesAfterInputChange(propName, childPropName, comp) {
  if (propName === 'startDate' || propName === 'endDate') {
    afterDateInputChange(propName, comp);
  }
  else {
    afterTimeInputChange(propName, childPropName, comp);
  }
}

function afterDateInputChange(propName, comp) {
  const otherPropName = propName === 'startDate' ? 'endDate' : 'startDate';
  const { state } = comp;
  const otherDateVal = state[otherPropName];
  if (state[propName] && (!otherDateVal || otherDateVal._wasAutoSet)) {
    comp.setState({
      [otherPropName]: {
        ...state[propName],
        _wasAutoSet: true
      }
    });
  }
}

export { performAutoChangesAfterInputChange };
