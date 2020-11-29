import {
  changeHandlerFactoryFactory,
  getStartingStateFactory,
  setSubmissionProcessingStateFactory,
  submitFactory,
  resetFactory
} from './methodFactories';

function bindCommonFormMethods(component, options) {
  component.changeHandlerFactory = changeHandlerFactoryFactory().bind(component);
  component.getStartingState = getStartingStateFactory().bind(component);
  component.setSubmissionProcessingState = setSubmissionProcessingStateFactory().bind(component);
  component.submit = submitFactory(options && options.hasCountdown).bind(component);
  component.reset = component.reset ? component.reset.bind(component) : resetFactory().bind(component);
}

function bindFormSpecificMethods(component) {
  const methodNames = [
    'getUniqueStartingState',
    'afterChange',
    'getInputProblems',
    'processAndSubmitData',
    'processSuccessResponse',
    'processErrorResponse',
    'afterSuccessCountdown'
  ];
  methodNames.forEach(methodName => {
    if (component[methodName]) {
      component[methodName] = component[methodName].bind(component);
    }
  });
}

function bindFormMethods(component) {
  bindCommonFormMethods(component);
  bindFormSpecificMethods(component);
}

export {
  bindFormMethods
};