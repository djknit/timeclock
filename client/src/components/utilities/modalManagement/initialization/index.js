import React from 'react';
import { areModalsOpenService } from '../../../../data';
import { getCompleteModalInfo } from '../elemental';
import { modalTogglerFactoryFactory } from './toggling';
import { modalActivityReporterFactory } from './activityReporting';

const unmountingReporterMethodName = '_reportAllModalsClosed';

function addModalsStateAndMethods(component, state, modalsInfo) {
  const modalsCompleteInfo = modalsInfo.map(getCompleteModalInfo);
  const _isActiveStatePropNames = modalsCompleteInfo.map(
    ({ isActiveStatePropName }) => isActiveStatePropName
  );

  const modalsRegistrationId = areModalsOpenService.getId();

  const reportModalActivity = (
    modalActivityReporterFactory(_isActiveStatePropNames, modalsRegistrationId).bind(component)
  );
  component.modalTogglerFactory = modalTogglerFactoryFactory(reportModalActivity).bind(component);
  
  component[unmountingReporterMethodName] = function () {
    areModalsOpenService.report(modalsRegistrationId, false);
  };

  modalsCompleteInfo.forEach(
    ({
      isActiveStatePropName,
      inputRefName,
      togglerName,
      otherStatePropToEditName,
      inputFocusMethodName
    }) => {
      state[isActiveStatePropName] = false;
      let inputRef;
      if (inputRefName) {
        inputRef = component[inputRefName] = React.createRef();
      }
      component[togglerName] = (
        component
        .modalTogglerFactory(
          isActiveStatePropName, inputRef, otherStatePropToEditName, inputFocusMethodName
        )
        .bind(component)
      );
    }
  );
}

function reportModalsClosedFor(component) {
  // not initialization, but put here b/c method is defined on component in main function above
  component[unmountingReporterMethodName]();
}

export {
  addModalsStateAndMethods,
  reportModalsClosedFor
};
