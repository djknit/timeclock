import { genericFormStates } from '../formState';
import { changeHandlerFactoryFactory } from './changeHandlers';
import { submitFactory } from './submit';

export * from '../formState'
export * from './changeHandlers';
export * from './submit';

function bindCommonFormMethods(component) {
  component.changeHandlerFactory = changeHandlerFactoryFactory().bind(component);
  component.getStartingState = getStartingStateFactory().bind(component);
  component.setSubmissionProcessingState = setSubmissionProcessingStateFactory().bind(component);
  component.submit = submitFactory().bind(this);
  component.reset = resetFactory().bind(this);
}

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
  bindCommonFormMethods,
  setSubmissionProcessingStateFactory,
  getStartingStateFactory,
  resetFactory
};