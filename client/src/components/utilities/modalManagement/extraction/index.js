import { getCompleteModalInfo } from '../elemental';

function extractModalsResources(component, modalsInfo) {
  
  const modalsCompleteInfo = modalsInfo.map(getCompleteModalInfo);

  const modals = modalsCompleteInfo.map(
    ({
      isActiveStatePropName,
      inputRefName,
      togglerName,
      ModalComponent,
      name
    }) => ({
      isActive: component.state[isActiveStatePropName],
      inputRef: inputRefName && component[inputRefName],
      toggle: component[togglerName],
      ModalComponent,
      name
    })
  );

  let modalTogglers = {};
  modalsCompleteInfo.forEach(({ name, togglerName }) => {
    modalTogglers[name] = component[togglerName];
  });

  return {
    modals,
    modalTogglers
  };
}

export { extractModalsResources };
