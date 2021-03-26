import React from 'react';
import {
  changeHandlerFactoryFactory,
  getStartingStateFactory,
  setSubmissionProcessingStateFactory,
  submitFactory,
  resetFactory
} from './methodFactories';
import { containerRefName } from './formState';

function bindCommonFormMethods(component, { hasCountdown, scrollOptions } = {}) {
  component.changeHandlerFactory = changeHandlerFactoryFactory().bind(component);
  component.getStartingState = getStartingStateFactory().bind(component);
  component.setSubmissionProcessingState = setSubmissionProcessingStateFactory().bind(component);
  component.submit = submitFactory(hasCountdown, scrollOptions).bind(component);
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
    'afterSuccessCountdown',
    'getWarnings'
  ];
  methodNames.forEach(methodName => {
    if (component[methodName]) {
      component[methodName] = component[methodName].bind(component);
    }
  });
}

function bindFormMethods(component, options) {
  bindCommonFormMethods(component, options);
  bindFormSpecificMethods(component);
  component[containerRefName] = React.createRef();
}

export {
  bindFormMethods
};
