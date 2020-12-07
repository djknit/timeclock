import { areModalsOpenService } from '../../data';

function addReportModalActivity(component, isActiveStatePropNames) {
  component.reportModalActivity = modalActivityReporterFactory(isActiveStatePropNames).bind(component);
}

function modalActivityReporterFactory(isActiveStatePropNames) {
  return function() {
    let hasModalOpen = false;
    isActiveStatePropNames.forEach(isActivePropName => {
      if (this.state[isActivePropName]) {
        hasModalOpen = true;
      }
    });
    const { modalsRegistrationId } = this.state;
    if (!modalsRegistrationId) console.log('Missing modals registration ID in ', this);
    areModalsOpenService.report(modalsRegistrationId, hasModalOpen);
  };
}

export default addReportModalActivity;
