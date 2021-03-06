import { afterTimeInputChange } from './times';

function timeSegmentFormAfterChangeFactory() {
  return function afterChange(propName, childPropName) {
    performAutoChangesAfterInputChange(propName, childPropName, this)
    .then(wasAutoChanged => {
      if (this.state.hasBeenSubmitted) {
        this.setState(this.getInputProblems());
      }
    });
  };
}

function performAutoChangesAfterInputChange(propName, childPropName, comp) {
  if (propName === 'startDate' || propName === 'endDate') {
    return afterDateInputChange(propName, comp);
  }
  else {
    return afterTimeInputChange(propName, childPropName, comp);
  }
}

function afterDateInputChange(propName, comp) {
  return new Promise(resolve => {
    const otherPropName = propName === 'startDate' ? 'endDate' : 'startDate';
    const { state } = comp;
    const otherDateVal = state[otherPropName];
    if (state[propName] && (!otherDateVal || otherDateVal._wasAutoSet)) {
      comp.setState(
        {
          [otherPropName]: {
            ...state[propName],
            _wasAutoSet: true
          }
        },
        () => resolve(true)
      );
    }
    else resolve(false);
  });
}

export {
  timeSegmentFormAfterChangeFactory
};
