import { areModalsOpenService } from '../../../../data';

function modalActivityReporterFactory(isActiveStatePropNames, modalsRegistrationId) {
  return function() {
    let hasModalOpen = false;
    isActiveStatePropNames.forEach(isActivePropName => {
      if (this.state[isActivePropName]) {
        hasModalOpen = true;
      }
    });
    if (!modalsRegistrationId && modalsRegistrationId !== 0) {
      console.log('Missing modals registration ID in ', this);
    }
    areModalsOpenService.report(modalsRegistrationId, hasModalOpen);
  };
}

export {
  modalActivityReporterFactory
};
