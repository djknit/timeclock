/* ABOUT THIS FOLDER/FILE:
  Util fxns for components with modals in them (the components where the modal togglers, activity states, etc. are kept and the modals are children of).
*/

import { addModalsStateAndMethods, reportModalsClosedFor } from './initialization';
import { extractModalsResources } from './extraction';
export * from './initialization';
export * from './extraction';

function createModalInfo(name, ModalComponent, hasInputRef, otherStatePropToEditName, inputFocusMethodName) {
  return {
    name, ModalComponent, hasInputRef, otherStatePropToEditName, inputFocusMethodName
  };
}

export { createModalInfo };

export const modalManagement = {
  addModalsStateAndMethods,
  reportModalsClosedFor,
  extractModalsResources,
  createModalInfo
};
