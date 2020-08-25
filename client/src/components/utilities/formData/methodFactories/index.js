import { genericFormStates } from '../formState';

export * from '../formState'
export * from './changeHandlers';
export * from './submit';

function setSubmissionProcessingStateFactory() {
  return function () {
    return new Promise(resolve => {
      this.setState(genericFormStates.submissionProcessing, resolve);
    });
  };
}

function getStartingStateFactory() {
  return function () {
    const specialStartState = this.getUniqueStartingState ? this.getUniqueStartingState() : {};
    return { ...genericFormStates.starting, ...specialStartState };
  };
}

function resetFactory() {
  return function () {
    this.setState(this.getStartingState());
  };
}

export {
  setSubmissionProcessingStateFactory,
  getStartingStateFactory,
  resetFactory
};